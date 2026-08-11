import { actions } from "astro:actions";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import { Button } from "ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "ui/dialog";

type Props = {
  id: string;
  inReview: boolean;
};

export const ReviewToggleButton = (props: Props) => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [inReview, setInReview] = createSignal(props.inReview);
  const [showRemoveDialog, setShowRemoveDialog] = createSignal(false);

  const handleAddToReview = async () => {
    setIsLoading(true);
    try {
      await actions.addToReview({ grammarPointId: props.id });
      toast.success("Added to review", {
        duration: 3000,
        position: "bottom-right",
      });
      setInReview(true);
    } catch {
      toast.error("Failed to add to review. Please try again later.", {
        duration: 4000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromReview = async () => {
    setIsLoading(true);
    try {
      setInReview(false);
      setShowRemoveDialog(false);
      await actions.removeFromReview({ grammarPointId: props.id });
      toast.success("Removed from review", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch {
      toast.error("Failed to remove from review. Please try again later.", {
        duration: 4000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleReview = () => {
    if (inReview()) {
      setShowRemoveDialog(true);
    } else {
      handleAddToReview();
    }
  };

  return (
    <>
      <Button
        variant={inReview() ? "destructive" : "secondary"}
        onClick={handleToggleReview}
        disabled={isLoading()}
      >
        {isLoading()
          ? inReview()
            ? "Removing..."
            : "Adding..."
          : inReview()
            ? "Remove from Review"
            : "Add to Review (Spaced Repetition)"}
      </Button>

      <Dialog open={showRemoveDialog()} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogDescription>
            Removing this grammar point from your review will delete all your
            progress with it. You'll need to start over if you add it again
            later.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleRemoveFromReview}
              disabled={isLoading()}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
