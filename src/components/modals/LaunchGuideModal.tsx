import { useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LaunchGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchGuideModal = ({ isOpen, onClose }: LaunchGuideModalProps) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in z-50" 
          onClick={onClose}
        />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-4xl translate-x-[-50%] translate-y-[-50%] border border-border bg-background shadow-2xl animate-scale-in rounded-lg overflow-hidden">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-semibold">Launch Guide</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-accent"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Video content */}
          <div className="p-6">
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://embed.screenapp.io/app/#/shared/Xc6VttPJOd?embed=true" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allowFullScreen
                className="w-full h-full"
                title="Launch Guide Video"
              />
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};