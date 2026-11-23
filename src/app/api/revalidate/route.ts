import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/functions/server/session";
import { CACHE_TAGS } from "@/constants/cache";

const ALLOWED_TAGS = [
  CACHE_TAGS.ACTIVITIES,
  CACHE_TAGS.ACTIVITY_CATEGORIES,
  CACHE_TAGS.CLUBS,
  CACHE_TAGS.LEADERBOARD_MONTHLY,
  CACHE_TAGS.PROVINCES,
] as const;

type AllowedTag = (typeof ALLOWED_TAGS)[number];

function isAllowedTag(tag: string): tag is AllowedTag {
  return (ALLOWED_TAGS as readonly string[]).includes(tag);
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tags } = body as { tags?: string[] };

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        {
          message:
            "Invalid tags parameter. Must be a non-empty array of strings.",
        },
        { status: 400 },
      );
    }

    const validTags = tags.filter(isAllowedTag);
    if (validTags.length === 0) {
      return NextResponse.json(
        {
          message:
            "No valid tags provided. Allowed tags are: " +
            ALLOWED_TAGS.join(", "),
          allowedTags: ALLOWED_TAGS,
        },
        { status: 400 },
      );
    }

    for (const tag of validTags) {
      revalidateTag(tag, {});
    }

    return NextResponse.json({
      message: "Cache invalidated successfully",
      revalidatedTags: validTags,
    });
  } catch (error) {
    console.error("Error revalidating cache:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
