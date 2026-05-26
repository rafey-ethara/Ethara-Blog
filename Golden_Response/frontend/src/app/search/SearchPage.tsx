'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { SearchResponse } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate, getReadingTime } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useSWR<{ success: boolean; data: SearchResponse }>(
    debouncedQuery.length >= 2 ? `/search?q=${encodeURIComponent(debouncedQuery)}` : null,
    fetcher
  );

  const results = data?.data?.posts || [];
  const total = data?.data?.pagination?.total || 0;

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 800 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <span className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>🔍 Search</span>
          <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
            Find an Article
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Search across all posts by title, topic, or keywords.</p>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ position: 'relative', marginBottom: 40 }}
        >
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            {isLoading ? <Spinner size={18} /> : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            type="search"
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="form-input"
            style={{ paddingLeft: 48, paddingRight: 48, fontSize: 18, height: 60, borderRadius: 16 }}
            aria-label="Search articles"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              aria-label="Clear search"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>

        {/* Results count */}
        {debouncedQuery.length >= 2 && !isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}
          >
            {total > 0 ? `${total} result${total !== 1 ? 's' : ''} for "${debouncedQuery}"` : `No results for "${debouncedQuery}"`}
          </motion.p>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {results.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card glass-hover"
                >
                  <Link href={`/blog/${post.slug}`} style={{ display: 'flex', gap: 20, padding: '20px 24px', textDecoration: 'none' }}>
                    {post.coverImage && (
                      <div style={{ position: 'relative', width: 100, height: 70, flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
                        <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <span className="badge" style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40`, fontSize: 10 }}>
                          {post.category.name}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 16, marginBottom: 4, lineHeight: 1.3 }}>
                        {post.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                        {post.excerpt}
                      </p>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>{getReadingTime(post.readingTime)}</span>
                        <span>·</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : debouncedQuery.length >= 2 && !isLoading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '60px 0' }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ fontSize: 60, marginBottom: 20 }}
              >
                🔍
              </motion.div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                No results found
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                No articles matched &ldquo;{debouncedQuery}&rdquo;. Try different keywords or browse all posts.
              </p>
              <Link href="/blog" className="btn btn-primary">
                Browse All Articles
              </Link>
            </motion.div>
          ) : query.length < 2 ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}
            >
              <p>Start typing to search...</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
