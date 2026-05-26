'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import api, { fetcher } from '@/lib/api';
import { Comment } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  content: z.string().min(5, 'Comment must be at least 5 characters').max(2000),
});
type FormData = z.infer<typeof schema>;

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data, mutate } = useSWR<{ success: boolean; data: Comment[] }>(`/comments/${postId}`, fetcher);
  const comments = data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (formData: FormData) => {
    try {
      await api.post(`/comments/${postId}`, formData);
      toast.success('Comment posted!');
      reset();
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to post comment');
    }
  };

  return (
    <section aria-label="Comments" style={{ marginTop: 60 }}>
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Comments ({comments.length})
      </h2>

      {/* Comment form */}
      <div className="card" style={{ padding: 28, marginBottom: 40 }}>
        <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Leave a Comment
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label htmlFor="comment-name" className="form-label">Name *</label>
              <input id="comment-name" type="text" placeholder="Your name" className={`form-input ${errors.name ? 'error' : ''}`} {...register('name')} />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="comment-email" className="form-label">Email *</label>
              <input id="comment-email" type="email" placeholder="you@email.com" className={`form-input ${errors.email ? 'error' : ''}`} {...register('email')} />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="comment-content" className="form-label">Comment *</label>
            <textarea id="comment-content" rows={4} placeholder="Share your thoughts..." className={`form-input ${errors.content ? 'error' : ''}`} {...register('content')} />
            {errors.content && <p className="form-error">{errors.content.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
            {isSubmitting && <Spinner size={16} color="white" />}
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
        {comments.map((comment, i) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card"
            style={{ padding: '20px 24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, #8B5CF6, #6366F1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{comment.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatRelativeDate(comment.createdAt)}</div>
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 15 }}>{comment.content}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
