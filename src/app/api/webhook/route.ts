import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/shared/lib/stripe";
import { prisma } from "@/shared/lib/prisma";
import Stripe from "stripe";
import { randomBytes } from "crypto";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === "paid") {
          const customerEmail = session.customer_details?.email;

          if (!customerEmail) {
            console.error("Missing customerEmail in session");
            return NextResponse.json(
              { error: "Missing customer email" },
              { status: 400 }
            );
          }

          const existingPurchases = await prisma.purchase.findMany({
            where: { stripeSessionId: session.id },
          });

          if (existingPurchases.length > 0) {
            console.log("Purchase already processed:", session.id);
            return NextResponse.json({ received: true });
          }

          const itemsMetadata = session.metadata?.items;
          
          if (itemsMetadata) {
            const items = JSON.parse(itemsMetadata) as Array<{
              posterId: string;
              quantity: number;
            }>;

            const lineItems = await stripe.checkout.sessions.listLineItems(
              session.id
            );

            const purchases = await Promise.all(
              items.map(async (item, index) => {
                const lineItem = lineItems.data[index];
                const downloadToken = randomBytes(32).toString("hex");

                return prisma.purchase.create({
                  data: {
                    posterId: item.posterId,
                    customerEmail,
                    stripeSessionId: session.id,
                    downloadToken,
                    quantity: item.quantity,
                    priceAtPurchase: lineItem?.price?.unit_amount || 0,
                  },
                });
              })
            );

            console.log("Multiple purchases created:", {
              sessionId: session.id,
              count: purchases.length,
              customerEmail,
            });
          } else {
            const posterId = session.metadata?.posterId;

            if (!posterId) {
              console.error("Missing posterId in session metadata");
              return NextResponse.json(
                { error: "Missing poster ID" },
                { status: 400 }
              );
            }

            const lineItems = await stripe.checkout.sessions.listLineItems(
              session.id
            );
            const lineItem = lineItems.data[0];

            const downloadToken = randomBytes(32).toString("hex");

            await prisma.purchase.create({
              data: {
                posterId,
                customerEmail,
                stripeSessionId: session.id,
                downloadToken,
                quantity: 1,
                priceAtPurchase: lineItem?.price?.unit_amount || 0,
              },
            });

            console.log("Single purchase created:", {
              sessionId: session.id,
              posterId,
              customerEmail,
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error processing webhook:", errorMessage);
    return NextResponse.json(
      { error: `Webhook processing error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
