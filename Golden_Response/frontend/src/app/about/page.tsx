import type { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Alex Carter, the writer behind Ethara Blog — exploring technology, design, and productivity.',
  openGraph: {
    title: 'About | Ethara Blog',
    description: 'Meet the author behind Ethara Blog',
  },
};

export default function About() {
  return <AboutPage />;
}
