import { prisma } from "@/shared/lib/prisma";
import { Purchase } from "../model/types";

export async function getPurchaseByToken(
  token: string
): Promise<Purchase | null> {
  const purchase = await prisma.purchase.findUnique({
    where: { downloadToken: token },
  });

  if (!purchase) {
    return null;
  }

  return purchase;
}
