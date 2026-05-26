'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  featuredPost?: Post | null;
}

const stats = [
  { value: '50+', label: 'Articles' },
  { value: '3K+', label: 'Readers' },
  { value: 'Weekly', label: 'New Posts' },
];

export default function HeroSection({ featuredPost }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 60]);
  const opacityText = useTransform(scrollY, [0, 320], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openNewsletter = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-newsletter'));
    }
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
      aria-label="Hero"
    >
      {/* ── Background ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Soft gradient wash */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(139,92,246,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Subtle dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.035,
            backgroundImage: 'radial-gradient(circle at 1px 1px, #A78BFA 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* Single accent orb — not too many */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="container relative z-10"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: featuredPost ? '1fr 1fr' : '1fr',
            gap: '80px',
            alignItems: 'center',
            paddingTop: 120,
            paddingBottom: 100,
          }}
        >
          {/* ── Left: Text column ──────────────────────── */}
          <div>
            {/* Eyebrow tag */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                style={{ marginBottom: 28 }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 14px',
                    borderRadius: 50,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: 'rgba(139,92,246,0.12)',
                    color: '#A78BFA',
                    border: '1px solid rgba(139,92,246,0.22)',
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#A78BFA',
                      display: 'inline-block',
                      boxShadow: '0 0 6px #A78BFA',
                    }}
                  />
                  Ethara Blog
                </span>
              </motion.div>
            )}

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(46px, 6vw, 80px)',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: 24,
                color: 'var(--text-primary)',
              }}
            >
              {mounted ? (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'block' }}
                  >
                    Ideas that
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'block' }}
                  >
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #A78BFA 0%, #818CF8 50%, #6366F1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      spark
                    </span>{' '}
                    curiosity.
                  </motion.span>
                </>
              ) : (
                <>
                  <span style={{ display: 'block' }}>Ideas that</span>
                  <span style={{ display: 'block' }}>spark curiosity.</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.44 }}
              style={{
                fontSize: 18,
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                maxWidth: 480,
                marginBottom: 40,
              }}
            >
              Deep dives into technology, design, and the ideas shaping how we
              build and think — written for curious minds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.56 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}
            >
              <Link
                href="/blog"
                className="btn btn-primary"
                style={{ fontSize: 15, padding: '13px 30px' }}
              >
                Start Reading
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button
                onClick={openNewsletter}
                className="btn btn-secondary"
                style={{ fontSize: 15, padding: '13px 30px' }}
              >
                Subscribe Free
              </button>
            </motion.div>

            {/* Stats — inline, not boxed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{ display: 'flex', gap: 36 }}
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: 'var(--accent-light)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Featured post card ───────────────── */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/blog/${featuredPost.slug}`} style={{ display: 'block' }}>
                <article
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    overflow: 'hidden',
                    transition: 'all 0.35s ease',
                    boxShadow: '0 4px 40px rgba(0,0,0,0.35)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-6px)';
                    el.style.boxShadow = '0 16px 60px rgba(139,92,246,0.22)';
                    el.style.borderColor = 'rgba(139,92,246,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 4px 40px rgba(0,0,0,0.35)';
                    el.style.borderColor = 'var(--border)';
                  }}
                >
                  {/* Cover image */}
                  {featuredPost.coverImage && (
                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                      <Image
                        src={featuredPost.coverImage}
                        alt={featuredPost.coverImageAlt || featuredPost.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="50vw"
                        priority
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(10,10,20,0.8) 0%, rgba(10,10,20,0.2) 50%, transparent 100%)',
                        }}
                      />
                      {/* Category badge over image */}
                      <div style={{ position: 'absolute', top: 16, left: 16 }}>
                        <span
                          className="badge"
                          style={{
                            background: `${featuredPost.category.color}22`,
                            color: featuredPost.category.color,
                            border: `1px solid ${featuredPost.category.color}44`,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {featuredPost.category.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Text */}
                  <div style={{ padding: '24px 28px 28px' }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: 10,
                      }}
                    >
                      Featured Post · {getReadingTime(featuredPost.readingTime)}
                    </div>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                        marginBottom: 10,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p
                      style={{
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: 20,
                      }}
                    >
                      {featuredPost.excerpt}
                    </p>

                    {/* Author row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {featuredPost.author.avatar && (
                          <Image
                            src={featuredPost.author.avatar}
                            alt={featuredPost.author.name}
                            width={32}
                            height={32}
                            style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                          />
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>
                            {featuredPost.author.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            {formatDate(featuredPost.publishedAt)}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--accent-light)',
                        }}
                      >
                        Read
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ── Scroll cue ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
