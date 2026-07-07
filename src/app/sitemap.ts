import type { MetadataRoute } from "next";

const BASE_URL = "https://kaderisasi.salmanitb.com";

type Activity = {
  slug: string;
  updated_at: string;
  is_published: number;
};

type APIPagiResponse<T> = {
  data: {
    data: T[];
    meta: {
      last_page: number;
    };
  };
};

async function getPublishedActivities(): Promise<Activity[]> {
  try {
    const activities: Activity[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_API}/activities?page=${page}&per_page=100`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          next: { revalidate: 3600 }, // Cache for 1 hour
        },
      );

      if (!response.ok) {
        break;
      }

      const data = (await response.json()) as APIPagiResponse<Activity>;
      const publishedActivities = data.data.data.filter(
        (activity) => activity.is_published === 1,
      );
      activities.push(...publishedActivities);

      hasMore = page < data.data.meta.last_page;
      page++;
    }

    return activities;
  } catch (error) {
    console.error("Failed to fetch activities for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activities = await getPublishedActivities();

  const currentDate = new Date();

  // Static pages - public routes only
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/activity`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/consultation`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/forgot`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic activity pages
  const activityPages: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${BASE_URL}/activity/${activity.slug}`,
    lastModified: new Date(activity.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...activityPages];
}
