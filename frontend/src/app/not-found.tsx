'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 20,
      }}
    >
      <div>
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <div
            className="gradient-text"
            style={{ fontSize: 160, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' }}
          >
            404
          </div>
        </motion.div>

        {/* Floating icon */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ fontSize: 60, marginBottom: 24 }}
        >
          🌌
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            Page not found
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Looks like this page wandered off into the void. Let&apos;s get you back on track.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/" className="btn btn-primary">Go Home</Link>
            <Link href="/blog" className="btn btn-secondary">Browse Blog</Link>
          </div>
        </motion.div>

        {/* Decorative particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'fixed',
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              borderRadius: '50%',
              background: ['#8B5CF6', '#6366F1', '#F59E0B', '#10B981'][i % 4],
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              opacity: 0.4,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
