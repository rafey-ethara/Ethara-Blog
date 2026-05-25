import type { Metadata } from 'next';
import SearchPage from './SearchPage';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search all articles on Ethara Blog',
};

export default function Search() {
  return <SearchPage />;
}
