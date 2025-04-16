import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Video, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoAnalysis {
  id: string;
  title: string;
  date: string;
  description?: string;
  saves: number;
  goals: number;
  // Add any other fields you need
}

interface VideoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoAnalysis | null;
}

export const VideoAnalysisModal = ({ isOpen, onClose, video }: VideoAnalysisModalProps) => {
  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">{video.title}</DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogDescription className="text-base">
                  Analysis from {new Date(video.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {video.description && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Saves Analysis</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Saves</span>
                        <span className="font-medium">{video.saves}</span>
                      </div>
                      {/* Add more save-related metrics here */}
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">Goals Analysis</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Goals Conceded</span>
                        <span className="font-medium">{video.goals}</span>
                      </div>
                      {/* Add more goal-related metrics here */}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Performance Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Save Percentage</span>
                      <p className="text-lg font-semibold">
                        {video.saves > 0 ? ((video.saves / (video.saves + video.goals)) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Clean Sheet</span>
                      <p className="text-lg font-semibold">
                        {video.goals === 0 ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}; 