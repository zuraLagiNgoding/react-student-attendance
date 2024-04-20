import { create } from "zustand";

type State = {
  date: Date;
};

type Action = {
  updateDate: (date: State["date"]) => void;
};

export const useDateStore = create<State & Action>((set) => ({
  date: new Date(),
  updateDate: (date) => set(() => ({ date })),
}));
