'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Post } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: Post;
  index?: number;
  featured?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── Standard Post Card ────────────────────────────────────────────────────────

function StandardCard({ post }: { post: Post }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Cover image */}
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: 'block', textDecoration: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9
            overflow: 'hidden',
            background: '#1A1A2E',
          }}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
              className="post-card-image"
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #1A1A2E, #212136)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="gradient-text" style={{ fontSize: '32px', fontWeight: 800 }}>
                E
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Category badge */}
        {post.category && (
          <span
            className="badge"
            style={{
              alignSelf: 'flex-start',
              background: post.category.color
                ? `${post.category.color}22`
                : 'rgba(139,92,246,0.15)',
              color: post.category.color || '#A78BFA',
              border: `1px solid ${post.category.color ? post.category.color + '44' : 'rgba(139,92,246,0.25)'}`,
            }}
          >
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#F8FAFC',
              lineHeight: 1.35,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLHeadingElement).style.color = '#A78BFA';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLHeadingElement).style.color = '#F8FAFC';
            }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            style={{
              fontSize: '14px',
              color: '#94A3B8',
              lineHeight: 1.65,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid #1E1E2E',
          }}
        >
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {post.author?.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="28px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {post.author?.name?.[0]?.toUpperCase() ?? 'A'}
                </span>
              )}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8' }}>
              {post.author?.name ?? 'Anonymous'}
            </span>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#64748B',
              }}
            >
              <ClockIcon />
              {getReadingTime(post.readingTime)}
            </span>
            {post.viewCount > 0 && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: '#64748B',
                }}
              >
                <EyeIcon />
                {post.viewCount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Featured Post Card ────────────────────────────────────────────────────────

function FeaturedCard({ post }: { post: Post }) {
  return (
    <div className="featured-card-inner">
      {/* Cover image */}
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: 'block', textDecoration: 'none', flexShrink: 0 }}
        tabIndex={-1}
        aria-hidden="true"
        className="featured-image-wrapper"
      >
        <div
          style={{
            position: 'relative',
            height: '100%',
            minHeight: '260px',
            background: '#1A1A2E',
            overflow: 'hidden',
          }}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
              className="post-card-image"
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #1A1A2E, #212136)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="gradient-text" style={{ fontSize: '60px', fontWeight: 800 }}>
                E
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge badge-amber" style={{ fontSize: '10px' }}>
            Featured
          </span>
          {post.category && (
            <span
              className="badge"
              style={{
                background: post.category.color
                  ? `${post.category.color}22`
                  : 'rgba(139,92,246,0.15)',
                color: post.category.color || '#A78BFA',
                border: `1px solid ${post.category.color ? post.category.color + '44' : 'rgba(139,92,246,0.25)'}`,
              }}
            >
              {post.category.name}
            </span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#F8FAFC',
              lineHeight: 1.3,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLHeadingElement).style.color = '#A78BFA';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLHeadingElement).style.color = '#F8FAFC';
            }}
          >
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p
            style={{
              fontSize: '15px',
              color: '#94A3B8',
              lineHeight: 1.7,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Date */}
        <p style={{ fontSize: '13px', color: '#64748B' }}>
          {formatDate(post.publishedAt || post.createdAt)}
        </p>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px solid #1E1E2E',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {post.author?.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="36px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {post.author?.name?.[0]?.toUpperCase() ?? 'A'}
                </span>
              )}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>
                {post.author?.name ?? 'Anonymous'}
              </p>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                {getReadingTime(post.readingTime)}
              </p>
            </div>
          </div>

          {post.viewCount > 0 && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '13px',
                color: '#64748B',
              }}
            >
              <EyeIcon />
              {post.viewCount.toLocaleString()} views
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function PostCard({ post, index = 0, featured = false }: PostCardProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <>
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`card post-card ${featured ? 'post-card--featured' : ''}`}
        style={{ height: '100%' }}
      >
        {featured ? <FeaturedCard post={post} /> : <StandardCard post={post} />}
      </motion.article>

      <style>{`
        .post-card:hover .post-card-image {
          transform: scale(1.04);
        }
        .featured-card-inner {
          display: grid;
          grid-template-columns: 1fr;
          height: 100%;
        }
        .featured-image-wrapper {
          min-height: 240px;
        }
        @media (min-width: 768px) {
          .post-card--featured .featured-card-inner {
            grid-template-columns: 1fr 1fr;
          }
          .post-card--featured .featured-image-wrapper {
            min-height: unset;
          }
        }
      `}</style>
    </>
  );
}
