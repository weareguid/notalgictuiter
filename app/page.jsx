import Feed from './components/Feed';

export const metadata = {
  title: 'Nostalgic Tuiter',
  description: 'Tu feed personal de noticias — RSS + Bluesky en una sola vista',
};

export default function Home() {
  return <Feed />;
}
