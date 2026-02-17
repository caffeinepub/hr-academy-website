// Frontend build diagnostics - single source of truth
// Values are injected at build time via environment variables
export const FRONTEND_BUILD_VERSION = import.meta.env.VITE_BUILD_VERSION || 'dev-local';
export const FRONTEND_BUILD_TIMESTAMP = import.meta.env.VITE_BUILD_TIMESTAMP 
  ? parseInt(import.meta.env.VITE_BUILD_TIMESTAMP, 10) 
  : Date.now();

export function formatBuildTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
