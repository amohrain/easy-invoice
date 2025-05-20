import { create } from "zustand";
import { clients } from "../constants/clients";

export const useClientStore = create((set) => ({
  clientId: "",
  setClientId: (clientId) => {
    set({ clientId });
  },
  clients: null,
  setSampleClients: () => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    set({
      clients: clients,
      clientId: client._id,
    });
    return client;
  },

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
