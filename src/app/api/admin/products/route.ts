import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { getSession } from "@/shared/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, category, imageUrl, fileUrl } = body;

    if (!title || !price || !imageUrl || !fileUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const poster = await prisma.poster.create({
      data: {
        title,
        description,
        price,
        category,
        imageUrl,
        fileUrl,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/products');

    return NextResponse.json(poster);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
