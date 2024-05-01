import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {},

  setUser: (user) => set({ user: user }),
}));

const useEcgStore = create((set) => ({
  ecg: [],
}));

export default useUserStore;
