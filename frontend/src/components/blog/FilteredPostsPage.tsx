'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Post, PostsResponse, Category } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';

interface FilteredPostsPageProps {
  type: 'category' | 'tag';
  slug: string;
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="card group"
    >
      <Link href={`/blog/${post.slug}`}>
        {post.coverImage && (
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} className="group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        )}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span className="badge" style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40`, fontSize: 11 }}>{post.category.name}</span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>{post.author.name}</span>
            <span>{getReadingTime(post.readingTime)} · {formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function FilteredPostsPage({ type, slug }: FilteredPostsPageProps) {
  const { data: filterData } = useSWR<{ success: boolean; data: any }>(
    `/${type === 'category' ? 'categories' : 'tags'}/${slug}`,
    fetcher
  );
  const filter = filterData?.data;

  const param = type === 'category' ? `category=${filter?._id}` : `tag=${filter?._id}`;
  const { data } = useSWR<{ success: boolean; data: PostsResponse }>(
    filter?._id ? `/posts?${param}&limit=12` : null,
    fetcher
  );
  const posts = data?.data?.posts || [];

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 60 }}>
        {/* Animated header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 56, maxWidth: 640 }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Link href="/blog" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              ← Back to Blog
            </Link>
          </motion.div>
          <span className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>
            {type === 'category' ? '📂 Category' : '🏷️ Tag'}
          </span>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>
            {filter?.name || slug}
          </h1>
          {filter?.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.7 }}>
              {filter.description}
            </p>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>
            {posts.length} article{posts.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Divider glow */}
        <div className="divider-glow" style={{ marginBottom: 48 }} />

        {/* Posts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {posts.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
          {posts.length === 0 && filter && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No posts yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Nothing published in this {type} yet.</p>
              <Link href="/blog" className="btn btn-primary">Browse All Posts</Link>
            </div>
          )}
        </div>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
