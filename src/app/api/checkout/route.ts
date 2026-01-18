import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/shared/lib/stripe";
import { getPosterById } from "@/entities/poster";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { posterId, items } = body;

    if (items && Array.isArray(items) && items.length > 0) {
      const lineItems = await Promise.all(
        items.map(async (item: { posterId: string; quantity: number }) => {
          const poster = await getPosterById(item.posterId);
          
          if (!poster) {
            throw new Error(`Poster not found: ${item.posterId}`);
          }

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: poster.title,
                description: poster.description || undefined,
                images: [poster.imageUrl],
              },
              unit_amount: poster.price,
            },
            quantity: item.quantity,
          };
        })
      );

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
        (req.headers.get("origin") ?? "http://localhost:3000");

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        billing_address_collection: "required",
        invoice_creation: {
          enabled: true,
        },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        metadata: {
          items: JSON.stringify(items),
        },
      });

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    if (!posterId) {
      return NextResponse.json(
        { error: "Poster ID or items are required" },
        { status: 400 }
      );
    }

    const poster = await getPosterById(posterId);

    if (!poster) {
      return NextResponse.json(
        { error: "Poster not found" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (req.headers.get("origin") ?? "http://localhost:3000");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: poster.title,
              description: poster.description || undefined,
              images: [poster.imageUrl],
            },
            unit_amount: poster.price,
          },
          quantity: 1,
        },
      ],
      billing_address_collection: "required",
      invoice_creation: {
        enabled: true,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        posterId: poster.id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
