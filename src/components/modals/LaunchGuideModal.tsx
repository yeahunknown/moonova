import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-4xl h-[95vh] max-h-[800px] translate-x-[-50%] translate-y-[-50%] border border-border bg-background shadow-2xl animate-scale-in rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-b border-border">
          <h2 className="text-lg sm:text-xl font-semibold">Step-by-Step Launch Guide | Moonova LLC</h2>
        </div>

        {/* Video content */}
        <div className="flex-1 p-3 sm:p-6 flex items-center justify-center min-h-0">
          <div className="aspect-video w-full max-w-full rounded-lg overflow-hidden shadow-lg">
            <video 
              src="https://storage.googleapis.com/store-screenapp-production/vid/68bd863eee698a739d797921/c2ee6aef-eef6-4dc8-be00-84f721063364.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=GOOG1EINEQV5X2QGY62PSZMBMUR7IGGVLKNDB6ABP5GL6O6FKO76DWA2IE3SB%2F20250907%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250907T131857Z&X-Amz-Expires=604800&X-Amz-Signature=aafe10fe27ae1a8b8a8a3451e489c71b07236a9017e0ac3483cd985aba220147&X-Amz-SignedHeaders=host&response-content-type=attachment%3B%20filename%3D%22c2ee6aef-eef6-4dc8-be00-84f721063364.mp4%22%3B%20filename%2A%3D%20UTF-8%27%27launch_guide.mp4%3B&x-amz-checksum-mode=ENABLED&x-id=GetObject#t=0"
              controls
              className="w-full h-full object-contain"
              controlsList="nodownload"
              preload="metadata"
              playsInline
              webkit-playsinline="true"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};