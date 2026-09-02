import { NextResponse, type NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DB_NAME = "toolnagri";
const COLLECTION_NAME = "janmashtami_wishes";

// Helper to generate a random 8-character unique ID
function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const track = searchParams.get("track") === "true"; // If true, don't increment views

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing 'id' parameter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const doc = await collection.findOne({ slug: id });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Wishing card not found" },
        { status: 404 }
      );
    }

    if (!track) {
      // Real view, increment view count
      await collection.updateOne({ slug: id }, { $inc: { views: 1 } });
      doc.views = (doc.views || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      wish: {
        sender: doc.sender,
        receiver: doc.receiver,
        lang: doc.lang,
        views: doc.views || 0,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    console.error("API GET /api/janmashtami failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sender, receiver, lang } = body;

    // Validation
    const cleanSender = sender?.trim();
    if (!cleanSender) {
      return NextResponse.json(
        { success: false, error: "Sender name is required" },
        { status: 400 }
      );
    }

    if (cleanSender.length > 50) {
      return NextResponse.json(
        { success: false, error: "Sender name cannot exceed 50 characters" },
        { status: 400 }
      );
    }

    const cleanReceiver = receiver?.trim() || "Everyone";
    if (cleanReceiver.length > 50) {
      return NextResponse.json(
        { success: false, error: "Receiver name cannot exceed 50 characters" },
        { status: 400 }
      );
    }

    const cleanLang = lang === "hi" ? "hi" : "en";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Create unique slug with collision checks (up to 5 retries)
    let slug = "";
    let isUnique = false;
    let retries = 0;

    while (!isUnique && retries < 5) {
      slug = generateSlug();
      const existing = await collection.findOne({ slug });
      if (!existing) {
        isUnique = true;
      }
      retries++;
    }

    if (!isUnique) {
      throw new Error("Failed to generate a unique slug");
    }

    const newWish = {
      slug,
      sender: cleanSender,
      receiver: cleanReceiver,
      lang: cleanLang,
      views: 0,
      createdAt: new Date(),
    };

    await collection.insertOne(newWish);

    // Send Telegram Notification asynchronously (fire-and-forget)
    const telegramToken = process.env.TELEGRAM_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChatId) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const message = `🦚 <b>New Janmashtami Wishing Card Created!</b>\n\n👤 <b>Sender:</b> ${cleanSender}\n👥 <b>Receiver:</b> ${cleanReceiver}\n🌐 <b>Language:</b> ${cleanLang === "hi" ? "Hindi 🇮🇳" : "English 🇬🇧"}\n🔑 <b>Slug ID:</b> <code>${slug}</code>\n🔗 <b>Card URL:</b> ${siteUrl}/janmashtami-2026?id=${slug}`;

      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: "HTML",
        }),
      }).catch((err) => {
        console.error("Failed to send Telegram message:", err);
      });
    }

    // Ensure TTL index is set so old wishes cleanup after 60 days
    try {
      await collection.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 60 * 24 * 60 * 60, name: "wishes_ttl" }
      );
      await collection.createIndex({ slug: 1 }, { unique: true, name: "slug_unique" });
    } catch (indexError) {
      console.warn("Index creation failed or already exists:", indexError);
    }

    return NextResponse.json({
      success: true,
      id: slug,
    });
  } catch (error) {
    console.error("API POST /api/janmashtami failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
