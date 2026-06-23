import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const client = await clientPromise;
    const db = client.db("toolnagri");
    const collection = db.collection("short_urls");

    const existing = await collection.findOne({ slug });

    if (!existing) {
      return NextResponse.redirect(new URL("/?error=not-found", request.url));
    }

    // Check expiry
    if (existing.expiresAt && new Date(existing.expiresAt) < new Date()) {
      // Slug has expired, delete it asynchronously
      await collection.deleteOne({ slug });
      return NextResponse.redirect(new URL("/?error=expired", request.url));
    }

    // Increment click count
    await collection.updateOne({ slug }, { $inc: { clicks: 1 } });

    // Redirect to original URL
    return NextResponse.redirect(new URL(existing.originalUrl));
  } catch (error) {
    console.error("Redirect handler error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
