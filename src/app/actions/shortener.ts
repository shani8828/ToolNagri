"use server";

import clientPromise from "@/lib/mongodb";

interface ShortUrlDoc {
  slug: string;
  originalUrl: string;
  createdAt: Date;
  expiresAt: Date | null;
  clicks: number;
}

// Generate random slug
function generateRandomSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

export async function createShortUrlAction(
  originalUrl: string,
  customSlug?: string,
  expiryOption?: string // '1h' | '1d' | '1w' | 'never'
) {
  try {
    if (!originalUrl) {
      return { success: false, error: "Original URL is required." };
    }

    // Basic URL validation
    let formattedUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      new URL(formattedUrl);
    } catch {
      return { success: false, error: "Invalid URL format." };
    }

    const client = await clientPromise;
    const db = client.db("toolnagri");
    const collection = db.collection<ShortUrlDoc>("short_urls");

    let slug = "";
    if (customSlug && customSlug.trim().length > 0) {
      slug = customSlug.trim();
      // Validate custom slug characters
      if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
        return {
          success: false,
          error: "Custom slug can only contain letters, numbers, hyphens, and underscores.",
        };
      }
      
      // Reserved names
      const reserved = ["url-shortener", "qr-generator", "password-generator", "age-calculator", "json-formatter", "image-compressor", "contact", "privacy", "terms", "disclaimer", "sitemap.xml", "robots.txt"];
      if (reserved.includes(slug.toLowerCase())) {
        return { success: false, error: "This slug is reserved and cannot be used." };
      }

      // Check if custom slug already exists
      const existing = await collection.findOne({ slug });
      if (existing) {
        // If expired, we can overwrite it
        if (existing.expiresAt && new Date(existing.expiresAt) < new Date()) {
          await collection.deleteOne({ slug });
        } else {
          return { success: false, error: "Custom slug is already in use." };
        }
      }
    } else {
      // Generate random unique slug
      let attempts = 0;
      while (attempts < 5) {
        slug = generateRandomSlug(6);
        const existing = await collection.findOne({ slug });
        if (!existing) break;
        attempts++;
      }
      if (attempts >= 5) {
        return { success: false, error: "Failed to generate unique slug. Please try again." };
      }
    }

    // Expiry Date Calculation
    let expiresAt: Date | null = null;
    if (expiryOption === "1h") {
      expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    } else if (expiryOption === "1d") {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (expiryOption === "1w") {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const newDoc: ShortUrlDoc = {
      slug,
      originalUrl: formattedUrl,
      createdAt: new Date(),
      expiresAt,
      clicks: 0,
    };

    await collection.insertOne(newDoc);

    return {
      success: true,
      slug,
      originalUrl: formattedUrl,
      expiresAt: expiresAt?.toISOString() || null,
    };
  } catch (error: unknown) {
    console.error("Error creating short URL:", error);
    return { success: false, error: "Database error occurred. Please try again later." };
  }
}

export async function getShortUrlsAnalyticsAction(slugs: string[]) {
  try {
    if (!slugs || slugs.length === 0) {
      return { success: true, data: [] };
    }

    const client = await clientPromise;
    const db = client.db("toolnagri");
    const collection = db.collection<ShortUrlDoc>("short_urls");

    const docs = await collection
      .find({ slug: { $in: slugs } })
      .project({ _id: 0 })
      .toArray();

    // Serialize dates to ISO Strings
    const formattedDocs = docs.map((doc) => ({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
      expiresAt: doc.expiresAt ? doc.expiresAt.toISOString() : null,
    }));

    return { success: true, data: formattedDocs };
  } catch (error: unknown) {
    console.error("Error fetching analytics:", error);
    return { success: false, error: "Failed to load analytics from database." };
  }
}
