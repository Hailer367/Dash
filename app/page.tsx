import { notFound } from 'next/navigation';

// Root shows a plain 404. Real pages live on manual paths only:
// /dash, /cbe, /telebirr
export default function Home() {
  notFound();
}
