import { useNavigate, useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';

const CONTACT_ANCHOR_ID = 'contact-section';
const PENDING_SCROLL_KEY = 'pendingContactScroll';

export function useContactScroll() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToContact = () => {
    const contactElement = document.getElementById(CONTACT_ANCHOR_ID);
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Clear any pending scroll flag
      sessionStorage.removeItem(PENDING_SCROLL_KEY);
    } else {
      // If element not found, we might need to navigate first
      if (location.pathname !== '/') {
        // Set flag and navigate to home
        sessionStorage.setItem(PENDING_SCROLL_KEY, 'true');
        navigate({ to: '/' });
      }
    }
  };

  return { scrollToContact };
}

export function usePendingContactScroll() {
  useEffect(() => {
    const shouldScroll = sessionStorage.getItem(PENDING_SCROLL_KEY);
    if (shouldScroll === 'true') {
      // Wait for DOM to be ready
      const timeoutId = setTimeout(() => {
        const contactElement = document.getElementById('contact-section');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          sessionStorage.removeItem(PENDING_SCROLL_KEY);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, []);
}
