import type { Metadata } from 'next';
import FilteredPostsPage from '@/components/blog/FilteredPostsPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `#${slug} — Tag`,
    description: `Articles tagged with ${slug} on Ethara Blog`,
    openGraph: { title: `#${slug} | Ethara Blog`, description: `Posts tagged with ${slug}` },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  return <FilteredPostsPage type="tag" slug={slug} />;
}
