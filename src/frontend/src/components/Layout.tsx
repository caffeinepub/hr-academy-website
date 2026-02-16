import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import PreviewBanner from './PreviewBanner';
import { usePendingContactScroll } from '@/hooks/useContactScroll';

export default function Layout() {
  usePendingContactScroll();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PreviewBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
