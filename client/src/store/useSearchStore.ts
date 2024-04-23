import { create } from "zustand";

type State = {
  search: string;
};

type Action = {
  updateSearch: (search: State["search"]) => void;
};

export const useSearchStore = create<State & Action>((set) => ({
  search: "",
  reset: set(() => ({ search: ""})),
  updateSearch: (search) => set(() => ({ search })),
}));
