import { createSignal } from "solid-js";
import { Button } from "ui/button";
import { toast } from "solid-sonner";
import { actions } from "astro:actions";

type Props = {
  id: string;
  inReview: boolean;
};

export const ReviewToggleButton = (props: Props) => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [inReview, setInReview] = createSignal(props.inReview);

  const handleToggleReview = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (inReview()) {
        await actions.removeFromReview({ grammarPointId: props.id });
        toast.success("Removed from review");
      } else {
        await actions.addToReview({ grammarPointId: props.id });
        toast.success("Added to review");
      }

      setInReview(!inReview());
    } catch (error) {
      toast.error(
        `Failed to ${inReview() ? "remove from" : "add to"} review. Please try again later.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};
