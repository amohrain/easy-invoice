import { toast } from "sonner";
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
      if (!response.ok) {
        toast.error("Error saving invoice");
        return;
      }
      const data = await response.json();
      toast.success("Invoice saved");
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Error saving invoice");
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
      toast.success("Invoice created successfully");
      return data.data;
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Error creating invoice");
    }
  },
  invoiceId: null,
  getInvoiceId: async () => {
    // This is redundant
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
  fetchClientById: async (clientId) => {
    const existingClients = JSON.parse(localStorage.getItem("clients"));
    const foundClient = existingClients?.find(
      (client) => client._id === clientId
    );

    try {
      if (foundClient) {
        const {
          clientName,
          clientAddress,
          clientEmail,
          clientPhone,
          clientTaxId,
        } = foundClient;

        return {
          clientName,
          clientAddress,
          clientEmail,
          clientPhone,
          clientTaxId,
        };
      } else {
        const response = await fetch(`/api/client/${clientId}`);
        const data = await response.json();

        const {
          clientName,
          clientAddress,
          clientEmail,
          clientPhone,
          clientTaxId,
        } = data.data || {};

        return {
          clientName,
          clientAddress,
          clientEmail,
          clientPhone,
          clientTaxId,
        };
      }
    } catch (error) {
      console.log("Error fetching client");
    }
  },

  // Function to create a new client
  createClient: async () => {
    try {
      const currentInvoice = get().invoice;

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
    } finally {
      localStorage.removeItem("clients");
    }
  },
  suggestion: null,
  createSuggestion: async (data) => {
    try {
      const response = await fetch("/api/suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, invoiceId: get().invoice._id }),
      });
      if (response.ok) {
        const data = await response.json();

        toast.success("Suggestion created successfully");
      }
    } catch (error) {
      console.log("Error creating suggestion", error);
      toast.error("Error creating suggestion");
    }
  },
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
        "/api/suggestion/" + suggestion._id,
        {
          method: "DELETE",
        }
      );

      if (!responseSuggestion.ok) {
        console.error("Error saving invoice");
      }
      toast.success("Suggestions accepted successfully");
    } catch (error) {
      console.error("Error accepting suggestions:", error);
      toast.error("Error accepting sugestions");
    }
  },
  acceptOneSuggestion: async () => {
    const invoice = get().invoice;
    const suggestion = get().suggestion;

    // console.log(
    //   invoice.clientName === suggestion.clientName,
    //   invoice.clientAddress === suggestion.clientAddress,
    //   invoice.clientEmail === suggestion.clientEmail,
    //   invoice.clientPhone === suggestion.clientPhone,
    //   invoice.clientTaxId === suggestion.clientTaxId
    // );

    if (
      invoice.clientName === suggestion.clientName &&
      invoice.clientAddress === suggestion.clientAddress &&
      invoice.clientEmail === suggestion.clientEmail &&
      invoice.clientPhone === suggestion.clientPhone &&
      invoice.clientTaxId === suggestion.clientTaxId
    ) {
      set({ invoice: { ...invoice, changesSuggested: false } });
      await get().deleteSuggestion();
    }
    await get().saveInvoice();
  },
  rejectSuggestion: async (key) => {
    const invoice = get().invoice;
    const suggestion = get().suggestion;
    suggestion[key] = invoice[key];

    set({ suggestion });
    await fetch("/api/suggestion/" + suggestion._id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(suggestion),
    });

    if (
      invoice.clientName === suggestion.clientName &&
      invoice.clientAddress === suggestion.clientAddress &&
      invoice.clientEmail === suggestion.clientEmail &&
      invoice.clientPhone === suggestion.clientPhone &&
      invoice.clientTaxId === suggestion.clientTaxId
    ) {
      set({ invoice: { ...invoice, changesSuggested: false } });
      await get().deleteSuggestion();
      await get().saveInvoice();
    }
  },
  deleteSuggestion: async () => {
    const suggestion = get().suggestion;
    try {
      const response = await fetch("/api/suggestion/" + suggestion._id, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Suggestion deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting suggestions, ", error);
      toast.error("Error deleting suggestion");
    }
  },
  fetchSuggestion: async () => {
    try {
      const invoice = get().invoice;
      const response = await fetch("/api/suggestion/" + invoice._id);
      const data = await response.json();
      set({ suggestion: data.data });
    } catch (error) {
      console.error("Error fetching suggestion: ", error);
    }
  },
  clearSuggestions: () => {
    set({ suggestion: null });
  },
  suggestions: null,
  fetchSuggestions: async () => {
    try {
      const response = await fetch("/api/suggestion");
      const data = await response.json();
      set({ suggestions: data.data });
    } catch (error) {
      console.error("Error fetching suggestions: ", error);
    }
  },
}));
