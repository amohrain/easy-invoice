import { create } from "zustand";

export const useStepsStore = create((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
}));
