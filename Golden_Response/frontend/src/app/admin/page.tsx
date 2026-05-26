'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { AdminStats, Post, PostsResponse } from '@/types';
import { formatDate } from '@/lib/utils';

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const animated = useCountUp(value);
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{animated.toLocaleString()}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>{label}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [userName, setUserName] = useState('Admin');
  const { data: statsData } = useSWR<{ success: boolean; data: AdminStats }>('/admin/stats', fetcher);
  const { data: postsData } = useSWR<{ success: boolean; data: PostsResponse }>('/posts?limit=5', fetcher);

  const stats = statsData?.data;
  const recentPosts = postsData?.data?.posts || [];

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('ethara_user') || '{}');
      if (user.name) setUserName(user.name);
    } catch {}
  }, []);

  const statCards = [
    {
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      label: 'Total Posts', value: stats?.posts || 0, color: '#8B5CF6',
    },
    {
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      label: 'Subscribers', value: stats?.subscribers || 0, color: '#10B981',
    },
    {
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      label: 'Contact Messages', value: stats?.contacts || 0, color: '#F59E0B',
    },
    {
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      label: 'Comments', value: stats?.comments || 0, color: '#6366F1',
    },
    {
      icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
      label: 'Total Views', value: stats?.totalViews || 0, color: '#EC4899',
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          Good day, {userName} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Here&apos;s what&apos;s happening with your blog.</p>
      </motion.div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin/posts/new" className="btn btn-primary">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Post
          </Link>
          <Link href="/admin/categories" className="btn btn-secondary">Manage Categories</Link>
          <Link href="/admin/subscribers" className="btn btn-secondary">View Subscribers</Link>
          <Link href="/admin/contacts" className="btn btn-secondary">View Messages</Link>
        </div>
      </motion.div>

      {/* Recent posts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Posts</h2>
          <Link href="/admin/posts" style={{ color: 'var(--accent-light)', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          {recentPosts.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No posts yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Category', 'Views', 'Date', ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge" style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40`, fontSize: 11 }}>{post.category.name}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13 }}>{post.viewCount.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(post.publishedAt)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link href={`/admin/posts/${post._id}/edit`} style={{ color: 'var(--accent-light)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
