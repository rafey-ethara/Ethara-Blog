'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { PostsResponse } from '@/types';
import { formatDate, getReadingTime } from '@/lib/utils';

const AUTHOR = {
  name: 'Alex Carter',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  role: 'Author & Editor',
  bio: "I'm a tech writer, design enthusiast, and lifelong learner based in San Francisco. I write about the intersection of technology and human experience — how we build, how we think, and how we can do both better. When I'm not writing, I'm probably reading, hiking, or staring at a CSS layout that refuses to cooperate.",
  socialLinks: {
    twitter: 'https://twitter.com/alexcarter',
    github: 'https://github.com/alexcarter',
    linkedin: 'https://linkedin.com/in/alexcarter',
  },
};

const skills = ['Next.js', 'TypeScript', 'Design Systems', 'Technical Writing', 'UX Research', 'AI/ML', 'CSS/Tailwind'];

export default function AboutPage() {
  const { data } = useSWR<{ success: boolean; data: PostsResponse }>('/posts?limit=4&sort=latest', fetcher);
  const recentPosts = data?.data?.posts || [];

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start' }}>
          {/* Left: Profile */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'sticky', top: 100 }}
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 200 }}
              style={{ position: 'relative', width: 180, height: 180, marginBottom: 24 }}
            >
              <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #6366F1, #F59E0B)', animation: 'spin 8s linear infinite' }} />
              <Image
                src={AUTHOR.avatar}
                alt={AUTHOR.name}
                fill
                style={{ objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--bg-primary)' }}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>{AUTHOR.name}</h1>
              <p className="gradient-text" style={{ fontWeight: 600, marginBottom: 16 }}>{AUTHOR.role}</p>

              {/* Social links */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                {AUTHOR.socialLinks.twitter && (
                  <a href={AUTHOR.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Twitter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {AUTHOR.socialLinks.github && (
                  <a href={AUTHOR.socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                  </a>
                )}
                {AUTHOR.socialLinks.linkedin && (
                  <a href={AUTHOR.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
                  </a>
                )}
              </div>

              {/* Skills */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Topics</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map((skill) => (
                    <span key={skill} className="badge badge-violet" style={{ fontSize: 11 }}>{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.aside>

          {/* Right: Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="badge badge-violet" style={{ marginBottom: 20, display: 'inline-flex' }}>✦ About</span>
            <h2 className="text-4xl font-black" style={{ color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1.2 }}>
              Exploring ideas at the edge of{' '}
              <span className="gradient-text">technology and creativity.</span>
            </h2>

            {AUTHOR.bio.split('\n').filter(Boolean).map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.8, marginBottom: 20 }}
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Mission */}
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              style={{ borderLeft: '4px solid var(--accent)', paddingLeft: 24, margin: '32px 0', background: 'rgba(139,92,246,0.08)', padding: '20px 24px', borderRadius: '0 12px 12px 0' }}
            >
              <p style={{ color: 'var(--text-primary)', fontSize: 18, fontStyle: 'italic', lineHeight: 1.7 }}>
                &ldquo;The best writing doesn&apos;t just inform — it changes how you see the world. That&apos;s what I&apos;m chasing every time I sit down to write.&rdquo;
              </p>
            </motion.blockquote>

            {/* Recent posts */}
            {recentPosts.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Recent Articles</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recentPosts.map((post, i) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="card glass-hover"
                      style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <span className="badge" style={{ background: `${post.category.color}20`, color: post.category.color, border: `1px solid ${post.category.color}40`, fontSize: 10, marginBottom: 6 }}>{post.category.name}</span>
                        <Link href={`/blog/${post.slug}`} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'block' }}>
                          {post.title}
                        </Link>
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(post.publishedAt)} · {getReadingTime(post.readingTime)}</span>
                      </div>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  ))}
                </div>
                <Link href="/blog" className="btn btn-secondary" style={{ marginTop: 20 }}>
                  View All Articles →
                </Link>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
