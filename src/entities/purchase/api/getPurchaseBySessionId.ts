import { prisma } from "@/shared/lib/prisma";
import { Purchase } from "../model/types";

export async function getPurchaseBySessionId(
  sessionId: string
): Promise<Purchase | null> {
  const purchase = await prisma.purchase.findFirst({
    where: { stripeSessionId: sessionId },
  });

  if (!purchase) {
    return null;
  }

  return purchase;
}
