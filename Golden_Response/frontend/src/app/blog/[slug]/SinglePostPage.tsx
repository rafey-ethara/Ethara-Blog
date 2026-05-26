'use client';
import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Post } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';
import ReadingProgress from '@/components/blog/ReadingProgress';
import PostActions from '@/components/blog/PostActions';
import CommentSection from '@/components/blog/CommentSection';
import { notFound } from 'next/navigation';

interface SinglePostPageProps {
  slug: string;
}

function AuthorBio({ author }: { author: Post['author'] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card"
      style={{ padding: '32px', marginTop: 48 }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {author.avatar && (
          <Image
            src={author.avatar}
            alt={author.name}
            width={80}
            height={80}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--border)' }}
          />
        )}
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Written by</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{author.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{author.bio}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {author.socialLinks?.twitter && (
              <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label={`${author.name} on Twitter`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {author.socialLinks?.linkedin && (
              <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label={`${author.name} on LinkedIn`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </a>
            )}
            {author.socialLinks?.github && (
              <a href={author.socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label={`${author.name} on GitHub`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SinglePostPage({ slug }: SinglePostPageProps) {
  const { data, error } = useSWR<{ success: boolean; data: Post }>(`/posts/${slug}`, fetcher);
  const post = data?.data;

  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, 80]);

  if (error) return notFound();

  if (!post) {
    return (
      <div style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="container-narrow">
          {/* Skeleton loader */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ height: 40, borderRadius: 8, background: 'var(--bg-elevated)', width: '60%' }} />
            <div style={{ height: 20, borderRadius: 8, background: 'var(--bg-elevated)', width: '40%' }} />
            <div style={{ height: 360, borderRadius: 16, background: 'var(--bg-elevated)' }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 18, borderRadius: 4, background: 'var(--bg-elevated)', width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ethara Blog',
    },
  };

  return (
    <>
      <ReadingProgress />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ paddingTop: 80 }}>
        {/* Hero / Cover image with parallax */}
        {post.coverImage && (
          <div ref={coverRef} style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
            <motion.div style={{ y: parallaxY, position: 'absolute', inset: '-80px 0 0 0' }}>
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="100vw"
              />
            </motion.div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,20,0.9) 0%, rgba(10,10,20,0.4) 60%, transparent 100%)' }} />
          </div>
        )}

        <div className="container-narrow" style={{ marginTop: post.coverImage ? -160 : 60, position: 'relative', paddingBottom: 80 }}>
          {/* Post header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 40 }}
          >
            {/* Category + tags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <Link href={`/category/${post.category.slug}`}>
                <span className="badge" style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40` }}>
                  {post.category.name}
                </span>
              </Link>
              {post.tags.map((tag) => (
                <Link key={tag._id} href={`/tag/${tag.slug}`}>
                  <span className="badge badge-violet" style={{ fontSize: 11 }}>{tag.name}</span>
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {post.author.avatar && (
                  <Image src={post.author.avatar} alt={post.author.name} width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                )}
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{post.author.name}</span>
              </div>
              <span>·</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span>{getReadingTime(post.readingTime)}</span>
              <span>·</span>
              <span>{post.viewCount.toLocaleString()} views</span>
            </div>
          </motion.header>

          {/* Article content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose-ethara"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Post actions */}
          <PostActions postId={post._id} initialLikes={post.likeCount} />

          {/* Author bio */}
          <AuthorBio author={post.author} />

          {/* Comments */}
          <CommentSection postId={post._id} />
        </div>
      </div>
    </>
  );
}
