'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (slug: string | null) => void;
}

// ─── Chevron icons ────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Pill item ────────────────────────────────────────────────────────────────

interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

function Pill({ label, isActive, onClick, color }: PillProps) {
  const activeColor = color || '#8B5CF6';

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 18px',
        borderRadius: '50px',
        fontSize: '13px',
        fontWeight: isActive ? 600 : 500,
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        color: isActive ? '#F8FAFC' : '#94A3B8',
        transition: 'color 0.2s',
        whiteSpace: 'nowrap',
        zIndex: 1,
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.color = '#F8FAFC';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
        }
      }}
    >
      {isActive && (
        <motion.span
          layoutId="active-category"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50px',
            background: color
              ? `linear-gradient(135deg, ${color}CC, ${color}88)`
              : 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            boxShadow: `0 4px 14px ${activeColor}44`,
            zIndex: -1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      {!isActive && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50px',
            border: '1px solid #2D2D44',
            background: 'rgba(26,26,46,0.6)',
            zIndex: -1,
            transition: 'border-color 0.2s, background 0.2s',
          }}
        />
      )}
      {label}
    </button>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -240 : 240;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div
      role="group"
      aria-label="Filter posts by category"
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      {/* Left scroll button */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            key="scroll-left"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => scrollBy('left')}
            aria-label="Scroll categories left"
            style={{
              flexShrink: 0,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(26,26,46,0.9)',
              border: '1px solid #2D2D44',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              zIndex: 2,
              boxShadow: '4px 0 12px rgba(10,10,20,0.5)',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = '#A78BFA';
              el.style.borderColor = 'rgba(139,92,246,0.4)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = '#94A3B8';
              el.style.borderColor = '#2D2D44';
            }}
          >
            <ChevronLeft />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable pill row */}
      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flex: 1,
          paddingBottom: '2px', // prevent clipping of box-shadow
        }}
      >
        {/* "All" pill */}
        <Pill
          label="All"
          isActive={selectedCategory === null}
          onClick={() => onSelect(null)}
        />

        {categories.map((cat) => (
          <Pill
            key={cat._id}
            label={cat.name}
            isActive={selectedCategory === cat.slug}
            onClick={() => onSelect(cat.slug)}
            color={cat.color}
          />
        ))}
      </div>

      {/* Right scroll button */}
      <AnimatePresence>
        {canScrollRight && categories.length > 3 && (
          <motion.button
            key="scroll-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => scrollBy('right')}
            aria-label="Scroll categories right"
            style={{
              flexShrink: 0,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(26,26,46,0.9)',
              border: '1px solid #2D2D44',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              zIndex: 2,
              boxShadow: '-4px 0 12px rgba(10,10,20,0.5)',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = '#A78BFA';
              el.style.borderColor = 'rgba(139,92,246,0.4)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = '#94A3B8';
              el.style.borderColor = '#2D2D44';
            }}
          >
            <ChevronRight />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hide native scrollbar */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
