/**
 * Best-effort helper to clear browser caches and reload the page.
 * Attempts to clear Cache Storage API and unregister service workers when available.
 * Falls back gracefully if APIs are unavailable.
 */
export async function refreshPreview(): Promise<void> {
  try {
    // Clear Cache Storage API if available
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      console.log('Cache Storage cleared');
    }

    // Unregister service workers if available
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister())
      );
      console.log('Service workers unregistered');
    }
  } catch (error) {
    console.warn('Cache clearing failed (non-critical):', error);
  }

  // Force a full page reload with cache bypass
  window.location.reload();
}
