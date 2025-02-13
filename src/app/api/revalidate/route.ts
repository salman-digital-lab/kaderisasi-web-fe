import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/functions/server/session';

// List of allowed tags that can be invalidated
const ALLOWED_TAGS = [
  'leaderboard',
  'monthly',
  'lifetime',
  'activities',
  'activities-list',
  'profile',
  'personal',
  'achievements',
  'provinces',
  'universities'
] as const;

type AllowedTag = typeof ALLOWED_TAGS[number];

// Type guard to check if a string is an allowed tag
function isAllowedTag(tag: string): tag is AllowedTag {
  return ALLOWED_TAGS.includes(tag as AllowedTag);
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await verifySession();
    if (!session.session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { tags } = body as { tags?: string[] };

    // Validate tags parameter
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { message: 'Invalid tags parameter. Must be a non-empty array of strings.' },
        { status: 400 }
      );
    }

    // Filter and validate tags
    const validTags = tags.filter(isAllowedTag);
    if (validTags.length === 0) {
      return NextResponse.json(
        { 
          message: 'No valid tags provided. Allowed tags are: ' + ALLOWED_TAGS.join(', '),
          allowedTags: ALLOWED_TAGS 
        },
        { status: 400 }
      );
    }

    // Revalidate each valid tag
    validTags.forEach(tag => {
      revalidateTag(tag);
    });

    return NextResponse.json({
      message: 'Cache invalidated successfully',
      revalidatedTags: validTags
    });
  } catch (error) {
    console.error('Error revalidating cache:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
} 