import type { Metadata } from 'next';
import SinglePostPage from './SinglePostPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  try {
    const res = await fetch(`${apiUrl}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Post Not Found' };
    const { data: post } = await res.json();

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
        images: post.coverImage ? [{ url: post.coverImage, alt: post.coverImageAlt || post.title }] : [],
        tags: post.tags.map((t: { name: string }) => t.name),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch {
    return { title: 'Post' };
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  return <SinglePostPage slug={slug} />;
}
