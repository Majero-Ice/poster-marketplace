import { prisma } from "@/shared/lib/prisma";
import { Poster } from "../model/types";

export async function getPosterById(id: string): Promise<Poster | null> {
  const poster = await prisma.poster.findUnique({
    where: { id },
  });

  if (!poster) {
    return null;
  }

  return {
    id: poster.id,
    title: poster.title,
    description: poster.description ?? undefined,
    price: poster.price,
    imageUrl: poster.imageUrl,
    fileUrl: poster.fileUrl,
    category: poster.category ?? undefined,
    createdAt: poster.createdAt,
    updatedAt: poster.updatedAt,
  };
}
