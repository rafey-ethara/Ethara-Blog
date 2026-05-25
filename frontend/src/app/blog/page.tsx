import type { Metadata } from 'next';
import BlogFeedPage from './BlogFeedPage';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Browse all articles on technology, design, and productivity.',
};

export default function BlogPage() {
  return <BlogFeedPage />;
}
