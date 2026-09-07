'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'button:not(:disabled), a[href], [role="button"]';

function shouldHandleNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download') || anchor.dataset.noPageTransition !== undefined) return false;

  const destination = new URL(anchor.href, window.location.href);
  if (destination.origin !== window.location.origin) return false;
  if (destination.pathname === window.location.pathname) return false;
  if (destination.pathname.startsWith('/admin')) return false;
  return true;
}

export default function SiteMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const enabled = !pathname.startsWith('/admin') && pathname !== '/card';

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(INTERACTIVE_SELECTOR) : null;
      if (!target || target.closest('[data-site-motion="off"]')) return;
      target.classList.remove('site-control-pressed');
      void target.offsetWidth;
      target.classList.add('site-control-pressed');
      window.setTimeout(() => target.classList.remove('site-control-pressed'), 360);
    };

    const handleClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || !shouldHandleNavigation(event, anchor) || !pageRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      const destination = new URL(anchor.href, window.location.href);
      pageRef.current.classList.add('site-page-leaving');

      if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = window.setTimeout(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      }, 135);

      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => pageRef.current?.classList.remove('site-page-leaving'), 1200);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('click', handleClick, true);
      if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current);
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    };
  }, [enabled, router]);

  if (!enabled) return <>{children}</>;

  return (
    <div key={pathname} ref={pageRef} className="site-motion-root site-motion-page">
      {children}
    </div>
  );
}
