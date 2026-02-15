import { useSearch, useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from './useQueries';

export function usePreviewMode() {
  const search = useSearch({ strict: false }) as { preview?: string };
  const navigate = useNavigate();
  const { data: isAdmin = false } = useIsCallerAdmin();

  const isPreviewMode = search.preview === '1';
  const canPreview = isAdmin && isPreviewMode;

  const enterPreview = (path: string = '/') => {
    navigate({ to: path, search: { preview: '1' } as any });
  };

  const exitPreview = () => {
    const currentPath = window.location.pathname;
    navigate({ to: currentPath as any, search: {} as any });
  };

  return {
    isPreviewMode,
    canPreview,
    isAdmin,
    enterPreview,
    exitPreview,
  };
}
