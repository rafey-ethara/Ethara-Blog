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
  phone: z.string().regex(/^[\+\d\s\-\(\)]{7,20}$/, 'Please enter a valid phone number'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 28 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
      await api.post('/contact', data);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (err: any) {
      const details = err.response?.data?.details;
      if (details) {
        Object.values(details).forEach((msg) => toast.error(msg as string));
      } else {
        toast.error(err.response?.data?.error || 'Failed to send message. Please try again.');
      }
    }
  };

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
          aria-label="Contact form"
        >
          <motion.div
            className="modal-box"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button
              onClick={handleClose}
              className="btn-icon"
              aria-label="Close contact modal"
              style={{ position: 'absolute', top: 16, right: 16 }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-8">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(252,211,77,0.15))', border: '1px solid rgba(245,158,11,0.3)' }}
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Get in Touch
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                      Have a question, collaboration idea, or just want to say hi? I&apos;d love to hear from you.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label htmlFor="contact-name" className="form-label">Name *</label>
                        <input id="contact-name" type="text" placeholder="Your name" className={`form-input ${errors.name ? 'error' : ''}`} {...register('name')} />
                        {errors.name && <p className="form-error">{errors.name.message}</p>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact-email" className="form-label">Email *</label>
                        <input id="contact-email" type="email" placeholder="you@email.com" className={`form-input ${errors.email ? 'error' : ''}`} {...register('email')} />
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-phone" className="form-label">Phone *</label>
                      <input id="contact-phone" type="tel" placeholder="+1 555 000 0000" className={`form-input ${errors.phone ? 'error' : ''}`} {...register('phone')} />
                      {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-subject" className="form-label">Subject *</label>
                      <input id="contact-subject" type="text" placeholder="What's this about?" className={`form-input ${errors.subject ? 'error' : ''}`} {...register('subject')} />
                      {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-message" className="form-label">Message (optional)</label>
                      <textarea id="contact-message" placeholder="Tell me more..." rows={4} className="form-input" {...register('message')} />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-amber"
                      disabled={isSubmitting}
                      style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }}
                    >
                      {isSubmitting ? <Spinner size={18} color="#0A0A14" /> : null}
                      {isSubmitting ? 'Sending...' : 'Send Message →'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}
                  >
                    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#0A0A14" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Message Sent! 📬
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Thanks for reaching out! I&apos;ll get back to you as soon as possible.
                  </p>
                  <button onClick={handleClose} className="btn btn-secondary" style={{ marginTop: 24 }}>
                    Close
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
