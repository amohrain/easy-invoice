import { create } from "zustand";

export const useCompanyStore = create((set, get) => ({
  company: null,
  setCompany: (company) => set({ company }),

  companyData: null,
  setCompanyData: (data) =>
    set((state) => ({
      companyData: { ...state.companyData, ...data },
    })),

  getCompanies: async () => {
    try {
      const response = await fetch("/api/company/");
      const data = await response.json();
      set({ company: data.data[0] });
      set({ companyData: data.data[0] });
      return data.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  },

  updateCompany: async (data) => {
    console.log("Updating company data:", data);
    const companyId = data._id;
    try {
      const response = await fetch(`/api/company?id=${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error updating company:", error);
    }
  },
}));
