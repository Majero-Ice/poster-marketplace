import { prisma } from "@/shared/lib/prisma";
import { Poster } from "../model/types";

export async function searchPosters(query: string): Promise<Poster[]> {
  if (!query.trim()) {
    return [];
  }

  const posters = await prisma.poster.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posters.map((poster) => ({
    id: poster.id,
    title: poster.title,
    description: poster.description ?? undefined,
    price: poster.price,
    imageUrl: poster.imageUrl,
    fileUrl: poster.fileUrl,
    category: poster.category ?? undefined,
    createdAt: poster.createdAt,
    updatedAt: poster.updatedAt,
  }));
}
