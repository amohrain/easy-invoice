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
  logo: null,
  setLogo: (logo) => set({ logo }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  getAndSetCompaniesData: async () => {
    const existing = JSON.parse(localStorage.getItem("company"));
    try {
      if (existing?.length) {
        set({ companyData: existing });
        return existing;
      } else {
        const response = await fetch("/api/company/");
        const data = await response.json();
        const companies = data.data;
        set({
          // companies: companies,
          // company: data.company,
          companyData: data.company,
        });
        return data.data;
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  },
  getCompanies: async () => {
    // Todo add localstorage caching
    let companies = [];
    let company = {};

    const existingCompanies = localStorage.getItem("companies");
    const existingCompany = localStorage.getItem("company");

    try {
      if (existingCompanies?.length > 0 && existingCompany) {
        console.log("Loading existing data");
        companies = JSON.parse(existingCompanies);
        company = JSON.parse(existingCompany);
      } else {
        const response = await fetch("/api/company/");
        const data = await response.json();
        companies = data.data;
        company = data.company;
        localStorage.setItem("companies", JSON.stringify(companies));
        localStorage.setItem("company", JSON.stringify(company));
      }
      set({
        companies,
        company,
        // companyData: data.company,
      });
      return companies;
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  },
  updateCompany: async (data) => {
    const companyId = data._id;
    try {
      get().setLoading(true);
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
    } finally {
      localStorage.removeItem("company");
      localStorage.removeItem("companies");
      get().getCompanies();
      get().setLoading(false);
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
      localStorage.setItem("company", JSON.stringify(selectedCompany));

      // Clear cached data related to the previous company
      localStorage.removeItem("clients");
      toast.success("Success");
      window.location.reload();
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    }
  },
  sampleCompany: () => {
    set({ company: sampleCompany });
  },
}));
