'use client';

import { useState, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── SVG Social Icons ─────────────────────────────────────────────────────────

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Column data ───────────────────────────────────────────────────────────────

const exploreLinks = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Search', href: '/search' },
];

const categoryLinks = [
  { label: 'Technology', slug: 'technology' },
  { label: 'Design', slug: 'design' },
  { label: 'Productivity', slug: 'productivity' },
];

const tagLinks = [
  { label: 'AI', slug: 'ai' },
  { label: 'Web Dev', slug: 'web-dev' },
  { label: 'CSS', slug: 'css' },
  { label: 'Figma', slug: 'figma' },
  { label: 'Focus', slug: 'focus' },
];

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#64748B',
        marginBottom: '16px',
      }}
    >
      {children}
    </h3>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        fontSize: '14px',
        color: '#94A3B8',
        textDecoration: 'none',
        padding: '4px 0',
        transition: 'color 0.2s',
        lineHeight: 1.5,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = '#A78BFA';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8';
      }}
    >
      {children}
    </Link>
  );
}

// ─── Newsletter mini form ──────────────────────────────────────────────────────

function MiniNewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-newsletter'));
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '4px' }}>
      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px', lineHeight: 1.6 }}>
        Get the best articles delivered right to your inbox.
      </p>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(26,26,46,0.6)',
          border: '1px solid #2D2D44',
          borderRadius: '50px',
          padding: '4px 4px 4px 14px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocusCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#8B5CF6';
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 0 0 3px rgba(139,92,246,0.15)';
        }}
        onBlurCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#2D2D44';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address for newsletter"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#F8FAFC',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 4px 14px rgba(139,92,246,0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          {/* Arrow icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </form>
  );
}

// ─── Main Footer ───────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Don't render the public footer on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer
      aria-label="Site footer"
      style={{
        marginTop: 'auto',
        borderTop: '1px solid transparent',
        background: `
          linear-gradient(#13131F, #13131F) padding-box,
          linear-gradient(90deg, transparent, #2D2D44 20%, #8B5CF6 50%, #2D2D44 80%, transparent) border-box
        `,
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
      }}
    >
      {/* Gradient divider line */}
      <div
        aria-hidden="true"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #2D2D44 15%, #8B5CF6 50%, #2D2D44 85%, transparent)',
        }}
      />

      <div className="container">
        {/* ── Top brand section ── */}
        <div
          style={{
            padding: '56px 0 48px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '40px',
            alignItems: 'start',
          }}
          className="footer-top"
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                marginBottom: '12px',
              }}
              aria-label="Ethara — go to homepage"
            >
              <span
                className="gradient-text"
                style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em' }}
              >
                Ethara
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#F59E0B',
                  boxShadow: '0 0 8px rgba(245,158,11,0.7)',
                  display: 'inline-block',
                  marginBottom: '14px',
                }}
              />
            </Link>
            <p
              style={{
                fontSize: '14px',
                color: '#64748B',
                maxWidth: '300px',
                lineHeight: 1.7,
                marginBottom: '20px',
              }}
            >
              Stories about technology, design, and the craft of building things that matter.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px' }} role="list" aria-label="Social links">
              {[
                {
                  href: 'https://twitter.com',
                  label: 'Follow us on X (Twitter)',
                  icon: <TwitterIcon />,
                },
                {
                  href: 'https://github.com',
                  label: 'View our GitHub',
                  icon: <GitHubIcon />,
                },
                {
                  href: 'https://linkedin.com',
                  label: 'Connect on LinkedIn',
                  icon: <LinkedInIcon />,
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  role="listitem"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(26,26,46,0.8)',
                    border: '1px solid #2D2D44',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748B',
                    textDecoration: 'none',
                    transition: 'color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = '#A78BFA';
                    el.style.borderColor = 'rgba(139,92,246,0.4)';
                    el.style.background = 'rgba(139,92,246,0.1)';
                    el.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = '#64748B';
                    el.style.borderColor = '#2D2D44';
                    el.style.background = 'rgba(26,26,46,0.8)';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Thin divider */}
        <div
          aria-hidden="true"
          style={{ height: '1px', background: '#1E1E2E', marginBottom: '48px' }}
        />

        {/* ── 4-column grid ── */}
        <div className="footer-grid">
          {/* Explore */}
          <div>
            <FooterHeading>Explore</FooterHeading>
            <nav aria-label="Explore links">
              {exploreLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <FooterHeading>Categories</FooterHeading>
            <nav aria-label="Category links">
              {categoryLinks.map((cat) => (
                <FooterLink key={cat.slug} href={`/category/${cat.slug}`}>
                  {cat.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Tags */}
          <div>
            <FooterHeading>Tags</FooterHeading>
            <nav aria-label="Tag links">
              {tagLinks.map((tag) => (
                <FooterLink key={tag.slug} href={`/tag/${tag.slug}`}>
                  #{tag.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Stay Updated */}
          <div>
            <FooterHeading>Stay Updated</FooterHeading>
            <MiniNewsletterForm />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            padding: '28px 0',
            marginTop: '48px',
            borderTop: '1px solid #1E1E2E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            © {currentYear} Ethara Blog. All rights reserved.
          </p>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Built with{' '}
            <span style={{ color: '#94A3B8', fontWeight: 500 }}>Next.js</span>
            {' '}and{' '}
            <span style={{ color: '#F43F5E' }} aria-label="love">
              ♥
            </span>
          </p>
        </div>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        .footer-top {
          grid-template-columns: 1fr;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px 32px;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
