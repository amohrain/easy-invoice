import { create } from "zustand";

export const useInvoiceStore = create((set, get) => ({
  invoice: null,
  invoiceData: null,
  setInvoice: (invoice) => set({ invoice }),
  getInvoiceById: async (invoiceId) => {
    const invoice = await fetch(`/api/invoice/${invoiceId}`);
    const data = await invoice.json();
    set({ invoice: data.data });
    return data.data;
  },
  getInvoices: async () => {
    try {
      const response = await fetch("/api/invoice");
      const data = await response.json();
      const invoices = data.data;
      set({ invoiceData: invoices });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  },
  saveInvoice: async (templateId) => {
    try {
      const invoice = get().invoice;
      const response = await fetch(`/api/invoice/${invoice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...invoice, template: templateId }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  },
  postInvoice: async (invoice) => {
    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });
      const data = await response.json();
      set({ invoice: data.data });
      return data.data;
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  },
  invoiceId: null,
  getInvoiceId: async () => {
    try {
      const response = await fetch("/api/invoice/number");
      const data = await response.json();
      set({ invoiceId: data.data });
      return data.data;
    } catch (error) {
      console.error("Error fetching invoice number:", error);
    }
  },

  // Function to fetch client ID for creating invocie
  fetchClientId: async (clientId) => {
    try {
      const response = await fetch(`/api/client/${clientId}`);
      const data = await response.json();

      const {
        clientName,
        clientAddress,
        clientEmail,
        clientPhone,
        clientTaxId,
      } = data.data;

      return {
        clientName,
        clientAddress,
        clientEmail,
        clientPhone,
        clientTaxId,
      };
    } catch (error) {
      console.log("Error fetching client");
    }

    return "ClientId";
  },

  // Function to create a new client
  // Todo
  createClient: async () => {
    try {
      const currentInvoice = get().invoice;

      // Test if the client already exists

      const existingRes = await fetch(
        `/api/client/query?name=${currentInvoice.clientName}&email=${currentInvoice.clientEmail}`
      );

      const existingData = await existingRes.json();
      const existingClientId = existingData.data;

      if (existingClientId) return existingClientId;

      const response = await fetch("/api/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: currentInvoice.clientName,
          clientAddress: currentInvoice.clientAddress,
          clientEmail: currentInvoice.clientEmail,
          clientPhone: currentInvoice.clientPhone,
          clientTaxId: currentInvoice.clientTaxId,
        }),
      });

      const data = await response.json();
      const clientId = data.data;
      return clientId;
    } catch (error) {
      console.log("Error creating client", error);
    }
  },
  suggestion: null,
  acceptSuggestions: async () => {
    try {
      const invoice = get().invoice;
      const suggestion = get().suggestion;
      const {
        clientName,
        clientAddress,
        clientEmail,
        clientPhone,
        clientTaxId,
      } = suggestion;

      // Save invoice
      const response = await fetch(`/api/invoice/${invoice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...invoice,
          clientName,
          clientAddress,
          clientEmail,
          clientPhone,
          clientTaxId,
          changesSuggested: false,
        }),
      });

      if (!response.ok) {
        console.error("Error saving invoice");
      }

      // Delete suggestion
      const responseSuggestion = await fetch(
        "/api/suggestion?id=" + suggestion._id,
        {
          method: "DELETE",
        }
      );

      if (!responseSuggestion.ok) {
        console.error("Error saving invoice");
      }

      console.log("Suggestions accepted successfully");
    } catch (error) {
      console.error("Error accepting suggestions:", error);
      // Toast
    }
  },
  fetchSuggestion: async () => {
    try {
      const invoice = get().invoice;
      const response = await fetch("/api/suggestion?id=" + invoice._id);
      const data = await response.json();

      // Todo toast
      set({ suggestion: data.data });
    } catch (error) {}
  },
}));
