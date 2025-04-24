import { create } from "zustand";

export const useClientStore = create((set) => ({
  clientId: "",
  setClientId: (clientId) => {
    set({ clientId });
  },
  clients: null,
  getClients: async () => {
    try {
      const response = await fetch("/api/client");
      const data = await response.json();
      console.log("Clients fetched: ", data.data);
      set({ clients: data.data });
      return data.data;
    } catch (error) {
      console.log("Error fetching clients: ", error);
    }
  },
}));
