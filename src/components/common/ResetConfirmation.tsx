import { Button } from "packages/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "packages/ui/dialog";
import { createSignal } from "solid-js";

export const ResetConfirmation = (props: {
  onReset: () => void;
  title: string;
}) => {
  const [open, setOpen] = createSignal(false);

  const handleReset = () => {
    props.onReset();
    setOpen(false);
  };
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost">Reset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to reset {props.title}?
          </DialogTitle>
          <DialogDescription>
            All changes you made during this session will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleReset}>
            Yes, reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
