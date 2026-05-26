'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  },
};

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 300);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/newsletter', data);
      setSubmitted(true);
    } catch (err: any) {
      const msg =
        err.response?.data?.details?.email ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.';
      toast.error(msg);
    }
  };

  // Close on Escape key
  if (typeof window !== 'undefined') {
    window.onkeydown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
          aria-label="Newsletter subscription"
        >
          <motion.div className="modal-box" variants={modalVariants} initial="hidden" animate="visible" exit="exit">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="btn-icon absolute top-4 right-4"
              aria-label="Close newsletter modal"
              style={{ position: 'absolute', top: 16, right: 16 }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}
                    >
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Stay in the loop
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                      Get the best articles delivered to your inbox. No spam, ever. Unsubscribe anytime.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label htmlFor="newsletter-name" className="form-label">Your Name</label>
                      <input
                        id="newsletter-name"
                        type="text"
                        placeholder="Alex Carter"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        {...register('name')}
                      />
                      {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 24 }}>
                      <label htmlFor="newsletter-email" className="form-label">Email Address</label>
                      <input
                        id="newsletter-email"
                        type="email"
                        placeholder="you@example.com"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        {...register('email')}
                      />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full justify-center"
                      disabled={isSubmitting}
                      style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                    >
                      {isSubmitting ? <Spinner size={18} color="white" /> : null}
                      {isSubmitting ? 'Subscribing...' : 'Subscribe Now ✦'}
                    </button>
                  </form>

                  <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    By subscribing, you agree to receive email updates from Ethara Blog.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-8"
                >
                  {/* Animated checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}
                  >
                    <motion.svg
                      width="36"
                      height="36"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      />
                    </motion.svg>
                  </motion.div>

                  {/* Confetti dots */}
                  <div className="relative">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: ['#8B5CF6', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#FCD34D'][i],
                          left: `${15 + i * 14}%`,
                          top: '-20px',
                        }}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: -40, opacity: 0, x: (i % 2 === 0 ? 1 : -1) * 20 }}
                        transition={{ duration: 0.8, delay: 0.1 * i }}
                      />
                    ))}
                  </div>

                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Welcome aboard! 🎉
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    You&apos;re all set. Check your inbox for a confirmation email. Great things coming your way!
                  </p>
                  <button onClick={handleClose} className="btn btn-secondary">
                    Back to Reading
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
