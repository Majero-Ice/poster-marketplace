import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { getSession } from "@/shared/lib/auth";
import { deleteFile } from "@/shared/lib/storage";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    const { title, description, price, category, imageUrl, fileUrl } = body;

    const existingPoster = await prisma.poster.findUnique({
      where: { id },
    });

    if (!existingPoster) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const poster = await prisma.poster.update({
      where: { id },
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
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const poster = await prisma.poster.findUnique({
      where: { id },
    });

    if (!poster) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    try {
      await deleteFile("posters", poster.fileUrl);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }

    await prisma.poster.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/admin/products');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
