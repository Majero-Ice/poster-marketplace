import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getSession } from "@/shared/lib/auth";
import { uploadFile } from "@/shared/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const posterFile = formData.get("file") as File;

    if (!title || !price || !imageFile || !posterFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const imageExt = imageFile.name.split(".").pop();
    const fileExt = posterFile.name.split(".").pop();
    const timestamp = Date.now();
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const imagePath = `images/${slug}-${timestamp}.${imageExt}`;
    const filePath = `files/${slug}-${timestamp}.${fileExt}`;

    const [imageUrl, fileUrl] = await Promise.all([
      uploadFile(imageFile, "posters", imagePath),
      uploadFile(posterFile, "posters", filePath),
    ]);

    const poster = await prisma.poster.create({
      data: {
        title,
        description,
        price,
        category,
        imageUrl,
        fileUrl: filePath,
      },
    });

    return NextResponse.json(poster);
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
