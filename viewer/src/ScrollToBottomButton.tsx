import { useEffect, useState } from 'react';

function canScrollDown(): boolean {
  const threshold = 40;
  return window.innerHeight + window.scrollY < document.documentElement.scrollHeight - threshold;
}

export function ScrollToBottomButton() {
  const [visible, setVisible] = useState(canScrollDown);

  useEffect(() => {
    const onScroll = () => setVisible(canScrollDown());
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="scroll to bottom"
      onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
      className="fixed bottom-6 left-[calc(50%+10.5rem)] flex h-12 w-12 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition hover:bg-slate-50 dark:border-ketchup-divider dark:bg-ketchup-surface dark:text-ketchup-text-2 dark:hover:bg-ketchup-bg-soft"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
