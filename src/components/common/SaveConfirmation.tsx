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
import { createSignal, type JSX } from "solid-js";

export const SaveConfirmation = (props: {
  onSave: () => void;
  title: string;
  children: JSX.Element;
}) => {
  const [open, setOpen] = createSignal(false);

  const handleSave = () => {
    props.onSave();
    setOpen(false);
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to save changes to {props.title}?
          </DialogTitle>
          <DialogDescription>
            All data related to {props.title} will be permanently changed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" onClick={handleSave}>
            Yes, save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
