export type Mode = "nav" | "cram";
export const Mode = {
  nav: "nav",
  cram: "cram",
} as const;

export const OppositeMode = {
  [Mode.nav]: Mode.cram,
  [Mode.cram]: Mode.nav,
};
