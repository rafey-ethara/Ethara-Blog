import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    // Fetch all published posts
    const postsRes = await fetch(`${API_URL}/posts?limit=100`, { next: { revalidate: 3600 } });
    const postsData = await postsRes.json();
    const postRoutes: MetadataRoute.Sitemap = (postsData?.data?.posts || []).map((post: any) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Fetch categories
    const catRes = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    const catData = await catRes.json();
    const categoryRoutes: MetadataRoute.Sitemap = (catData?.data || []).map((cat: any) => ({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Fetch tags
    const tagRes = await fetch(`${API_URL}/tags`, { next: { revalidate: 3600 } });
    const tagData = await tagRes.json();
    const tagRoutes: MetadataRoute.Sitemap = (tagData?.data || []).map((tag: any) => ({
      url: `${SITE_URL}/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
  } catch {
    return staticRoutes;
  }
}
