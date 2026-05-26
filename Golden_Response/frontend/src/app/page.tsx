'use client';
import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import HeroSection from '@/components/home/HeroSection';
import NewsletterModal from '@/components/modals/NewsletterModal';
import ContactModal from '@/components/modals/ContactModal';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Post, PostsResponse } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';

function PostCard({ post, index }: { post: Post; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card group"
    >
      <Link href={`/blog/${post.slug}`}>
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
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,20,0.6) 0%, transparent 50%)' }} />
          </div>
        )}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span
              className="badge"
              style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40`, fontSize: 11 }}
            >
              {post.category.name}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{getReadingTime(post.readingTime)}</span>
          </div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 10,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 16,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <span style={{ color: 'var(--text-muted)' }}>{post.author.name}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function NewsletterSection({ onOpen }: { onOpen: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{
        margin: '80px 0',
        padding: '60px 40px',
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.1) 100%)',
        border: '1px solid rgba(139,92,246,0.25)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Newsletter signup"
    >
      <div style={{ position: 'absolute', top: -80, right: -80, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent)', pointerEvents: 'none' }} />

      <span className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>✦ Newsletter</span>
      <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
        Never miss a good read
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 480, margin: '0 auto 32px' }}>
        Join thousands of curious minds who get our best articles delivered weekly. No noise — just great content.
      </p>
      <button onClick={onOpen} className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
        Subscribe for Free →
      </button>
    </motion.section>
  );
}

export default function HomePage() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data } = useSWR<{ success: boolean; data: PostsResponse }>('/posts?limit=10', fetcher);
  const posts = data?.data?.posts || [];
  const featuredPost = posts[0] ?? null;
  const gridPosts = posts.slice(1);

  useEffect(() => {
    const handler = () => setNewsletterOpen(true);
    window.addEventListener('open-newsletter', handler);
    return () => window.removeEventListener('open-newsletter', handler);
  }, []);

  // Get unique categories from grid posts (excluding featured)
  const categories = [
    { id: 'all', name: 'All' },
    ...Array.from(new Map(gridPosts.map((p) => [p.category._id, p.category])).values()).map((c) => ({
      id: c._id,
      name: c.name,
    })),
  ];

  const filteredPosts = selectedCategory === 'all' ? gridPosts : gridPosts.filter((p) => p.category._id === selectedCategory);

  return (
    <>
      <HeroSection featuredPost={featuredPost} />

      <div className="container">
        {/* Category filter */}
        {gridPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', gap: 10, marginBottom: 40, overflowX: 'auto', paddingBottom: 8, flexWrap: 'wrap' }}
            role="group"
            aria-label="Filter posts by category"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="btn"
                style={{
                  padding: '8px 20px',
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid',
                  transition: 'all 0.2s',
                  background: selectedCategory === cat.id ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'transparent',
                  borderColor: selectedCategory === cat.id ? 'transparent' : 'var(--border)',
                  color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
                }}
                aria-pressed={selectedCategory === cat.id}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Latest Articles
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Insights, ideas, and inspiration</p>
          </div>
          <Link href="/blog" className="btn btn-secondary" style={{ fontSize: 13 }}>
            View All →
          </Link>
        </div>

        {/* Posts grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
            marginBottom: 40,
          }}
        >
          {filteredPosts.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="card"
                  style={{ height: 340, background: 'linear-gradient(90deg, var(--bg-card), var(--bg-elevated), var(--bg-card))', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}
                />
              ))
            : filteredPosts.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
        </div>

        <NewsletterSection onOpen={() => setNewsletterOpen(true)} />
      </div>

      <NewsletterModal isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
