import { prisma } from "@/shared/lib/prisma";
import { Purchase } from "../model/types";

export async function getPurchasesBySessionId(
  sessionId: string
): Promise<Purchase[]> {
  const purchases = await prisma.purchase.findMany({
    where: { stripeSessionId: sessionId },
    include: {
      poster: true,
    },
  });

  return purchases;
}
