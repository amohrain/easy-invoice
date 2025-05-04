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
        console.log(data);
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
      console.log("Suggestions accepted successfully");
    } catch (error) {
      console.error("Error accepting suggestions:", error);
      toast.error("Error accepting sugestions");
    }
  },
  deleteSuggestion: async (id) => {
    try {
      const response = await fetch("/api/suggestion/" + id, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Suggestion deleted succesfully");
        toast.success("Suggestion deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting suggestions, ", error);
      toast.error("Error deleting suggestion");
    }
  },

  // Todo - to add a later stage - not too late
  acceptOneSuggestion: async (key) => {
    // let key received was clientName
    try {
      console.log("Accepting suggestion");
      const invoice = { ...get().invoice };
      const suggestion = get().suggestion;

      const { [key]: value } = suggestion;

      invoice[key] = value;

      // Save invoice
      const response = await fetch(`/api/invoice/${invoice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) {
        console.error("Error saving invoice");
      }

      console.log("Suggestion accepted successfully");
    } catch (error) {
      console.error("Error accepting suggestion:", error);
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
