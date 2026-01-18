import { NextResponse } from "next/server";
import { searchPosters } from "@/entities/poster";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ posters: [] });
    }

    const posters = await searchPosters(query);

    return NextResponse.json({ posters });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search posters" },
      { status: 500 }
    );
  }
}
