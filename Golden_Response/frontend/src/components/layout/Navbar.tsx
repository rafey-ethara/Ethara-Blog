'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.g
            key="close"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </motion.g>
        ) : (
          <motion.g
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const openNewsletter = () => {
    window.dispatchEvent(new CustomEvent('open-newsletter'));
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Don't render the public navbar on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.header
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
          background: isScrolled
            ? 'rgba(10, 10, 20, 0.85)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled
            ? '1px solid #2D2D44'
            : '1px solid transparent',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '68px',
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
              aria-label="Ethara — go to homepage"
            >
              <span
                className="gradient-text"
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                Ethara
              </span>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#F59E0B',
                  boxShadow: '0 0 8px rgba(245,158,11,0.7)',
                  display: 'inline-block',
                  marginBottom: '12px',
                }}
                aria-hidden="true"
              />
            </Link>

            {/* Desktop nav links */}
            <nav
              aria-label="Primary links"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              className="desktop-nav"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive(link.href)
                      ? '#A78BFA'
                      : '#94A3B8',
                    background: isActive(link.href)
                      ? 'rgba(139,92,246,0.1)'
                      : 'transparent',
                    transition: 'color 0.2s, background 0.2s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#F8FAFC';
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8';
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Search link */}
              <Link
                href="/search"
                aria-label="Search posts"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive('/search') ? '#A78BFA' : '#94A3B8',
                  background: isActive('/search')
                    ? 'rgba(139,92,246,0.1)'
                    : 'transparent',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/search')) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#F8FAFC';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/search')) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }
                }}
              >
                <SearchIcon size={16} />
                Search
              </Link>
            </nav>

            {/* Right side actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Subscribe button — desktop */}
              <button
                onClick={openNewsletter}
                className="btn btn-primary desktop-subscribe"
                style={{ fontSize: '13px', padding: '9px 20px' }}
              >
                Subscribe
              </button>

              {/* Hamburger — mobile */}
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                className="mobile-menu-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(26,26,46,0.8)',
                  border: '1px solid #2D2D44',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: '#F8FAFC',
                  flexShrink: 0,
                }}
              >
                <HamburgerIcon isOpen={isMenuOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-label="Mobile navigation menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              style={{
                overflow: 'hidden',
                borderTop: '1px solid #2D2D44',
                background: 'rgba(10,10,20,0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                style={{ padding: '16px 24px 24px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontWeight: 500,
                          textDecoration: 'none',
                          color: isActive(link.href) ? '#A78BFA' : '#94A3B8',
                          background: isActive(link.href)
                            ? 'rgba(139,92,246,0.12)'
                            : 'transparent',
                          transition: 'color 0.2s, background 0.2s',
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + navLinks.length * 0.05 }}
                  >
                    <Link
                      href="/search"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        color: isActive('/search') ? '#A78BFA' : '#94A3B8',
                        background: isActive('/search')
                          ? 'rgba(139,92,246,0.12)'
                          : 'transparent',
                        transition: 'color 0.2s, background 0.2s',
                      }}
                    >
                      <SearchIcon size={18} />
                      Search
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + (navLinks.length + 1) * 0.05 }}
                    style={{ marginTop: '12px' }}
                  >
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openNewsletter();
                      }}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Subscribe to Newsletter
                    </button>
                  </motion.div>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div style={{ height: '68px' }} aria-hidden="true" />

      {/* Responsive styles injected via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-subscribe { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
