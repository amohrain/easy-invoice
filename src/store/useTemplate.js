import { create } from "zustand";

export const useTemplateStore = create((set, get) => ({
  loading: false,
  setLoading: (boolean) => set({ loading: boolean }),
  template: null,
  userTemplates: null,
  setTemplate: (template) => set({ template }),
  templatesData: null,
  getAllTemplates: async () => {
    try {
      set({ loading: true });
      const response = await fetch("/api/templates");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const templates = data.data || [];

      set({ templatesData: templates });

      return templates;
    } catch (error) {
      console.error("Error fetching templates: ", error);
    } finally {
      set({ loading: false });
    }
  },
  getTemplatesData: async (templateId) => {
    try {
      set({ loading: true });
      const response = await fetch("/api/templates");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const templates = data.data || [];

      set({ templatesData: templates });

      if (templateId) {
        const template = templates.find((temp) => temp._id === templateId);
        set({ template: template || templates[0] });
      } else {
        set({ template: templates[0] });
      }

      return templates;
    } catch (error) {
      console.error("Error fetching templates: ", error);
    } finally {
      set({ loading: false });
    }
  },
  getTemplateById: async (templateId) => {
    const template = await fetch(`/api/templates/${templateId}`);
    const data = await template.json();
    set({ template: data.data });
    return data.data;
  },
  getUsersTemplates: async () => {
    try {
      const response = await fetch("/api/users/templates");
      const data = await response.json();
      const templates = data.data || [];
      set({ userTemplates: templates });
      return templates;
    } catch (error) {
      console.error("Error fetching user templates: ", error);
    }
  },
  addTemplate: async (templateId) => {
    try {
      // update user with new templates
      const response = await fetch(`/api/users/templates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const templates = data.data || [];
      console.log("Added template: ", templates);
      set({ userTemplates: templates });
    } catch (error) {
      console.error("Error adding template: ", error);
    }
  },
  removeTemplate: async (templateId) => {
    try {
      // update user with new templates
      const response = await fetch(`/api/users/templates`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const templates = data.data || [];
      set({ userTemplates: templates });
    } catch (error) {
      console.error("Error removing template: ", error);
    }
  },
}));
