import type { MetadataRoute } from "next";
import { supabaseServer } from "@/app/_lib/supabase/server";

export const revalidate = 3600;

function getBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "https://www.sinaal.ink";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/merchant`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/reset-password`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confirm-email`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/confirm-order`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  try {
    const supabase = supabaseServer();
    const { data: stores, error } = await supabase
      .from("stores")
      .select("id, slug, updated_at")
      .eq("is_deleted", false);

    if (error || !stores?.length) {
      return staticRoutes;
    }

    const dynamicStoreRoutes: MetadataRoute.Sitemap = stores.map((store) => {
      const storePath = store.slug || store.id;

      return {
        url: `${baseUrl}/store/${storePath}`,
        lastModified: store.updated_at ? new Date(store.updated_at) : now,
        changeFrequency: "daily",
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...dynamicStoreRoutes];
  } catch {
    // Keep sitemap generation resilient if env vars or DB are unavailable.
    return staticRoutes;
  }
}
