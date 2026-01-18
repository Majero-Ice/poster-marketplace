import { prisma } from "@/shared/lib/prisma";

export async function markAsDownloaded(purchaseId: string): Promise<void> {
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { downloadedAt: new Date() },
  });
}
