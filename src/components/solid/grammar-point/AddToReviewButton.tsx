import { Show, createSignal } from "solid-js";
import { Badge } from "ui/badge";
import { Button } from "ui/button";
import { toast } from "solid-sonner";
import { actions } from "astro:actions";

type Props = {
  id: string;
  disabled?: boolean;
};

export const AddToReviewButton = (props: Props) => {
  const [isAdding, setIsAdding] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);

  const handleAddToReview = async () => {
    if (props.disabled) return;

    setIsAdding(true);
    try {
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
        <Badge variant="success" class="min-w-[77px]">
          In review
        </Badge>
      }
    >
      <Button
        variant="outline"
        onClick={handleAddToReview}
        disabled={isAdding()}
      >
        {isAdding() ? "Adding..." : "Add to review"}
      </Button>
    </Show>
  );
};
