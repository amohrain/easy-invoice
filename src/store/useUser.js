import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  getCurrentUser: async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    set({ user: data.data });
    return data.data;
  },
}));
