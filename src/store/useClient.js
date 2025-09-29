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
    let clients = [];
    const existingClients = JSON.parse(localStorage.getItem("clients"));
    try {
      if (existingClients) {
        clients = existingClients;
      } else {
        const response = await fetch("/api/client");
        const data = await response.json();
        clients = data.data;
        localStorage.setItem("clients", JSON.stringify(clients));
      }

      set({ clients: clients });
      return clients;
    } catch (error) {
      console.log("Error fetching clients: ", error);
    }
  },
}));
