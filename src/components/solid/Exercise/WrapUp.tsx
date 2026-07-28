import { Button } from "packages/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "packages/ui/dialog";
import { createSignal } from "solid-js";

export const WrapUp = (props: {
  onShowResults: () => void;
  onFinishStarted: () => void;
}) => {
  const [open, setOpen] = createSignal(false);

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost">Finish session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finish the session?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You can first finish the exercises you got wrong, or just view the
          results.
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="default"
            onClick={() => handleAction(props.onFinishStarted)}
          >
            Redo Wrong
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction(props.onShowResults)}
          >
            View Results
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
