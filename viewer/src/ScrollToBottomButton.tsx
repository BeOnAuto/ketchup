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
      className="fixed right-6 bottom-6 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 dark:border-ketchup-divider dark:bg-ketchup-surface dark:text-ketchup-text-2 dark:hover:bg-ketchup-bg-soft"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
