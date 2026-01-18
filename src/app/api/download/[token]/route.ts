import { NextRequest, NextResponse } from "next/server";
import { getPurchaseByToken, markAsDownloaded } from "@/entities/purchase";
import { getPosterById } from "@/entities/poster";
import { getSignedDownloadUrl } from "@/shared/lib/supabase";

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { token } = await context.params;

  if (!token) {
    return NextResponse.json(
      { error: "Download token is required" },
      { status: 400 }
    );
  }

  try {
    const purchase = await getPurchaseByToken(token);

    if (!purchase) {
      return NextResponse.json(
        { error: "Invalid download token" },
        { status: 404 }
      );
    }

    const poster = await getPosterById(purchase.posterId);

    if (!poster) {
      return NextResponse.json(
        { error: "Poster not found" },
        { status: 404 }
      );
    }

    const signedUrl = await getSignedDownloadUrl(poster.fileUrl, 3600);

    if (!signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 }
      );
    }

    if (!purchase.downloadedAt) {
      await markAsDownloaded(purchase.id);
    }

    return NextResponse.json({
      downloadUrl: signedUrl,
      posterTitle: poster.title,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Error processing download request:", error);
    return NextResponse.json(
      { error: "Failed to process download request" },
      { status: 500 }
    );
  }
}
