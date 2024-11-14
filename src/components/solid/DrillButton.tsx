import { createSignal } from "solid-js";
import { Toaster } from "solid-toast";
import type { Drill } from "../../models/drill";
import { fetchWithToast } from "./utils";
import type { GrammarPoint } from "@grammar-sdk";

export const DrillButton = (props: {
  grammarPoint: Omit<GrammarPoint, "exercises">;
  drill?: Drill;
}) => {
  const [submitted, setSubmitted] = createSignal(false);
  const disabled = () => !!props.drill || submitted();

  const handleAddToDrill = async () => {
    setSubmitted(true);
    await fetchWithToast(
      "/api/drill",
      {
        body: props.grammarPoint,
        method: "POST",
      },
      "Successfully added to drill!",
      "Error has occurred , try to add later!",
    );
  };

  const handleRemoveFromDrill = async () => {
    setSubmitted(false);
    await fetchWithToast(
      `/api/drill/${props.grammarPoint.id}`,
      {
        method: "DELETE",
      },
      "Successfully removed from drill!",
      "Can't remove drill, please try again later!",
    );
  };

  return (
    <div class="flex gap-5">
      <button
        type="button"
        disabled={!disabled()}
        onClick={handleRemoveFromDrill}
        class="flex-1 rounded-full bg-red-600 px-6 py-3 text-center text-white shadow-md enabled:hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {"Remove from drill"}
      </button>
      <button
        type="button"
        disabled={disabled()}
        onClick={handleAddToDrill}
        class="flex-1 rounded-full bg-blue-500 px-6 py-3 text-center text-white shadow-md enabled:hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {props.drill ? "Already in drill" : "Drill"}
      </button>
      <Toaster />
    </div>
  );
};
