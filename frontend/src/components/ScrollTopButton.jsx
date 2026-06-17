import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 360);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed right-5 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-primary-700 shadow-glow-lg backdrop-blur-xl ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
