import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { getSession } from "@/shared/lib/auth";
import { uploadFile, deleteFile } from "@/shared/lib/storage";

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
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File | null;
    const posterFile = formData.get("file") as File | null;

    const existingPoster = await prisma.poster.findUnique({
      where: { id },
    });

    if (!existingPoster) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let imageUrl = existingPoster.imageUrl;
    let fileUrl = existingPoster.fileUrl;

    if (imageFile && imageFile.size > 0) {
      const imageExt = imageFile.name.split(".").pop();
      const timestamp = Date.now();
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const imagePath = `images/${slug}-${timestamp}.${imageExt}`;
      
      imageUrl = await uploadFile(imageFile, "posters", imagePath);
    }

    if (posterFile && posterFile.size > 0) {
      const fileExt = posterFile.name.split(".").pop();
      const timestamp = Date.now();
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const filePath = `files/${slug}-${timestamp}.${fileExt}`;
      
      fileUrl = filePath;
      await uploadFile(posterFile, "posters", filePath);
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
