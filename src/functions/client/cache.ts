type RevalidateResponse = {
  message: string;
  revalidatedTags?: string[];
  allowedTags?: string[];
};

export async function invalidateCache(tags: string[]): Promise<RevalidateResponse> {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to invalidate cache');
    }

    return await response.json();
  } catch (error) {
    console.error('Error invalidating cache:', error);
    throw error;
  }
} 