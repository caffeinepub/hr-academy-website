import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import PreviewBanner from './PreviewBanner';

export default function Layout() {
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
