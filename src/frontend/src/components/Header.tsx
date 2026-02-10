import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import BrandLogo from './BrandLogo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Gallery', path: '/gallery' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent-red/20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandLogo showText={false} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-white transition-colors hover:text-accent-red"
              activeProps={{
                className: 'text-accent-red',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/contact">
            <Button
              size="sm"
              className="bg-accent-red hover:bg-accent-red/90 text-white"
            >
              Contact Us
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/contact">
            <Button
              size="sm"
              className="bg-accent-red hover:bg-accent-red/90 text-white"
            >
              Contact Us
            </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-black border-accent-red/20">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-white transition-colors hover:text-accent-red"
                    activeProps={{
                      className: 'text-accent-red',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
