import { MetadataRoute } from "next";

const BASE_URL = "https://kaderisasi.salmanitb.com";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/profile",
          "/activity/register/",
          "/leaderboard/submit",
          "/leaderboard/edit/",
          "/custom-form/",
          "/form/",
          "/clubs/registration-info/",
          "/reset",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
