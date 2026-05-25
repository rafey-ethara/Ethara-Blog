import type { Metadata } from 'next';
import FilteredPostsPage from '@/components/blog/FilteredPostsPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiUrl}/categories/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: 'Category' };
    const { data } = await res.json();
    return {
      title: `${data.name} — Category`,
      description: data.description || `Articles in the ${data.name} category`,
      openGraph: { title: `${data.name} | Ethara Blog`, description: data.description },
    };
  } catch {
    return { title: 'Category' };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <FilteredPostsPage type="category" slug={slug} />;
}
