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
import { IconButton } from "packages/ui/icon-button";
import { AiFillDelete } from "solid-icons/ai";

export const DeleteConfirmation = (props: {
  onDelete: () => void;
  title: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <IconButton variant="destructive" size="md">
          <AiFillDelete />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete {props.title}?
          </DialogTitle>
          <DialogDescription>
            All data related to {props.title} will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={props.onDelete}>
            Yes, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
