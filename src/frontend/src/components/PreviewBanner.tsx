import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, X } from 'lucide-react';
import { usePreviewMode } from '@/hooks/usePreviewMode';

export default function PreviewBanner() {
  const { canPreview, exitPreview } = usePreviewMode();

  if (!canPreview) return null;

  return (
    <Alert className="rounded-none border-x-0 border-t-0 border-b-2 border-accent-red bg-accent-red/10 backdrop-blur-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-accent-red" />
          <AlertDescription className="text-sm font-medium text-white">
            Preview Mode - You are viewing draft content
          </AlertDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={exitPreview}
          className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
        >
          <X className="h-4 w-4 mr-1" />
          Exit Preview
        </Button>
      </div>
    </Alert>
  );
}
