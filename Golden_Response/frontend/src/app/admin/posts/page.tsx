'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import api, { fetcher } from '@/lib/api';
import { Post, PostsResponse } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminPostsPage() {
  const [search, setSearch] = useState('');
  const { data, mutate } = useSWR<{ success: boolean; data: PostsResponse }>('/posts?limit=50', fetcher);
  const allPosts = data?.data?.posts || [];
  const filtered = allPosts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted');
      mutate();
    } catch {
      toast.error('Failed to delete post');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Posts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{allPosts.length} posts total</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New Post
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ paddingLeft: 42 }}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No posts found
                </td>
              </tr>
            )}
            {filtered.map((post, i) => (
              <motion.tr
                key={post._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <td style={{ padding: '14px 16px', maxWidth: 280 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{post.slug}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge" style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40`, fontSize: 11 }}>{post.category.name}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge ${post.status === 'published' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 11 }}>
                    {post.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13 }}>{post.viewCount.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>{formatDate(post.publishedAt)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/posts/${post._id}/edit`} className="btn" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, border: '1px solid var(--border)', color: 'var(--accent-light)', background: 'transparent' }}>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id, post.title)}
                      className="btn"
                      style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E', background: 'rgba(244,63,94,0.08)', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
