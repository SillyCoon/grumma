export type Label = {
  id: number;
  name: string;
  color: string;
};

export type CreateLabel = Omit<Label, "id">;
export type UpdateLabel = Partial<Omit<Label, "id">> & Pick<Label, "id">;
