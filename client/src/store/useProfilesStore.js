import { create } from "zustand";

const useProfilesStore = create((set) => ({
  profiles: [],
  currentProfile: {},

  setProfiles: (profiles) => set({ profiles: profiles }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),

  addProfile: (profile) =>
    set({
      profiles: [...state.profiles, profile],
    }),

  deleteProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      currentProfile: state.profiles[0],
    })),

  updateProfile: (profile) => {
    set((state) => ({
      profiles: state.profiles.map((p) => (p.id === profile.id ? profile : p)),
    }));
  },
}));

export default useProfilesStore;

