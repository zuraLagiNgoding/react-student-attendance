import { Socket } from "socket.io-client";
import { create } from "zustand";

type State = {
  socket: Socket | null;
};

type Action = {
  updateSocket: (socket: State["socket"]) => void;
};

export const useSocketStore = create<State & Action>((set) => ({
  socket: null,
  updateSocket: (socket) => set(() => ({ socket })),
}));
