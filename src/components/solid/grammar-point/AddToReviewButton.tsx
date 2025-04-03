import { Show, createSignal } from "solid-js";
import { Button } from "ui/button";
import { toast } from "solid-sonner";
import { actions } from "astro:actions";

type Props = {
  id: string;
  inReview?: boolean;
};

export const AddToReviewButton = (props: Props) => {
  const [isAdding, setIsAdding] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);

  const handleAddToReview = async () => {
    if (props.inReview) return;

    setIsAdding(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await actions.addToReview({ grammarPointId: props.id });
      setIsSuccess(true);
    } catch (error) {
      toast.error("Failed to add to review. Please try again later.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Show
      when={!isSuccess()}
      fallback={
        <Button variant="secondary" disabled>
          In review
        </Button>
      }
    >
      <Button
        variant="secondary"
        onClick={handleAddToReview}
        disabled={isAdding() || props.inReview}
      >
        {isAdding()
          ? "Adding..."
          : props.inReview
            ? "In review"
            : "Add to Review (Spaced Repetition)"}
      </Button>
    </Show>
  );
};
