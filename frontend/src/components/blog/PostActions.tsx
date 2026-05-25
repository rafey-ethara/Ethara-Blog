'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

interface PostActionsProps {
  postId: string;
  initialLikes: number;
}

export default function PostActions({ postId, initialLikes }: PostActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setLikes(res.data.data.likeCount);
      setLiked(true);
    } catch {
      toast.error('Failed to like post');
    }
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
    toast.success(bookmarked ? 'Bookmark removed' : 'Post bookmarked!');
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: '',
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } else {
      window.open(links[platform], '_blank', 'noopener,noreferrer');
    }
    setShowShareMenu(false);
  };

  return (
    <div
      className="flex items-center gap-3 py-6"
      style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Like button */}
      <motion.button
        onClick={handleLike}
        whileTap={{ scale: 0.85 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
        style={{
          background: liked ? 'rgba(244,63,94,0.15)' : 'var(--bg-elevated)',
          border: `1px solid ${liked ? 'rgba(244,63,94,0.4)' : 'var(--border)'}`,
          color: liked ? '#F43F5E' : 'var(--text-secondary)',
          cursor: liked ? 'default' : 'pointer',
        }}
        aria-label={`Like this post (${likes} likes)`}
        disabled={liked}
      >
        <motion.svg
          width="18"
          height="18"
          fill={liked ? '#F43F5E' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          animate={liked ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </motion.svg>
        <span className="text-sm font-semibold">{likes}</span>
      </motion.button>

      {/* Bookmark button */}
      <motion.button
        onClick={handleBookmark}
        whileTap={{ rotateY: 180 }}
        className="btn-icon"
        style={{
          background: bookmarked ? 'rgba(139,92,246,0.15)' : 'var(--bg-elevated)',
          borderColor: bookmarked ? 'rgba(139,92,246,0.4)' : 'var(--border)',
          color: bookmarked ? 'var(--accent-light)' : 'var(--text-secondary)',
        }}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this post'}
      >
        <svg width="16" height="16" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </motion.button>

      {/* Share button */}
      <div style={{ position: 'relative' }}>
        <motion.button
          onClick={() => setShowShareMenu((prev) => !prev)}
          whileTap={{ scale: 0.9 }}
          className="btn-icon"
          aria-label="Share this post"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'absolute',
                bottom: '120%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px',
                minWidth: 160,
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                zIndex: 50,
              }}
            >
              {[
                { id: 'twitter', label: 'Share on X', icon: '𝕏' },
                { id: 'linkedin', label: 'Share on LinkedIn', icon: 'in' },
                { id: 'copy', label: 'Copy Link', icon: '🔗' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleShare(item.id)}
                  className="btn-ghost w-full text-left"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, width: '100%' }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, minWidth: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 13 }}>{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
