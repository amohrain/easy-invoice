import { create } from "zustand";
import { sampleCompany } from "../constants/sampleCompany";
import { toast } from "sonner";

export const useCompanyStore = create((set, get) => ({
  company: {},
  companies: [],
  setCompany: (company) => set({ company }),

  companyData: {},
  setCompanyData: (data) =>
    set((state) => ({
      companyData: { ...state.companyData, ...data },
    })),

  getCompanies: async () => {
    try {
      const response = await fetch("/api/company/");
      const data = await response.json();
      const companies = data.data;
      set({
        companies: companies,
        company: data.company,
        companyData: data.company,
      });
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
      if (response.ok) toast.success("Company updated successfully");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    }
  },
  changeCompany: async (companyId) => {
    try {
      await fetch("/api/users/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: companyId }),
      });
      const companies = get().companies;
      const selectedCompany = companies.find(
        (company) => company._id === companyId
      );
      set({ company: selectedCompany, companyData: selectedCompany });
      toast.success("Success");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    }
  },
  sampleCompany: () => {
    set({ company: sampleCompany });
  },
}));
