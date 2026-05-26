'use client';
import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Post, PostsResponse, Category } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';

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
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Link href={`/blog/${post.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {post.coverImage && (
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
              className="group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="badge" style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40`, fontSize: 11 }}>
              {post.category.name}
            </span>
            {post.tags.slice(0, 1).map((tag) => (
              <span key={tag._id} className="badge badge-violet" style={{ fontSize: 10 }}>{tag.name}</span>
            ))}
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>{post.author.name}</span>
            <div style={{ display: 'flex', gap: 12, color: 'var(--text-muted)' }}>
              <span>{getReadingTime(post.readingTime)}</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useSWR<{ success: boolean; data: Category[] }>('/categories', fetcher);
  const categories = categoriesData?.data || [];

  const params = new URLSearchParams({
    page: String(page),
    limit: '9',
    sort,
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedTag && { tag: selectedTag }),
  });

  const { data } = useSWR<{ success: boolean; data: PostsResponse }>(`/posts?${params}`, fetcher);
  const posts = data?.data?.posts || [];
  const pagination = data?.data?.pagination;

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 60 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <span className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>✦ All Articles</span>
          <h1 className="text-5xl font-black gradient-text" style={{ marginBottom: 12 }}>The Blog</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Ideas, insights, and deep dives worth your time.</p>
        </motion.div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40, alignItems: 'center' }}>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => { setSelectedCategory(''); setPage(1); }}
              className="btn"
              style={{ padding: '7px 16px', fontSize: 13, borderRadius: 50, border: '1px solid', background: !selectedCategory ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'transparent', borderColor: !selectedCategory ? 'transparent' : 'var(--border)', color: !selectedCategory ? 'white' : 'var(--text-secondary)' }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                className="btn"
                style={{ padding: '7px 16px', fontSize: 13, borderRadius: 50, border: '1px solid', background: selectedCategory === cat._id ? `${cat.color}20` : 'transparent', borderColor: selectedCategory === cat._id ? cat.color : 'var(--border)', color: selectedCategory === cat._id ? cat.color : 'var(--text-secondary)' }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ marginLeft: 'auto' }}>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="form-input"
              style={{ padding: '8px 36px 8px 14px', fontSize: 13, width: 'auto', cursor: 'pointer' }}
              aria-label="Sort posts"
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Viewed</option>
              <option value="trending">Most Liked</option>
            </select>
          </div>
        </div>

        {/* Posts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {posts.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
          {posts.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No posts found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 60 }}>
            <button onClick={() => setPage(page - 1)} disabled={!pagination.hasPrev} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
              ← Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="btn"
                style={{ width: 40, height: 40, padding: 0, justifyContent: 'center', borderRadius: 8, border: '1px solid', background: page === p ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'transparent', borderColor: page === p ? 'transparent' : 'var(--border)', color: page === p ? 'white' : 'var(--text-secondary)' }}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setPage(page + 1)} disabled={!pagination.hasNext} className="btn btn-secondary" style={{ padding: '8px 20px' }}>
              Next →
            </button>
          </div>
        )}
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
