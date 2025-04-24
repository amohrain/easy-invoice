"use client";
import React, { useEffect, useState } from "react";
import { useTemplateStore } from "@/store/useTemplate";
import LeftBar from "@/components/LeftBar";
import { useCompanyStore } from "@/store/useCompany";
import { useUser } from "@clerk/nextjs";
import { MiniInvoice } from "@/components/MiniInvoice";

function Templates() {
  const {
    userTemplates,
    templatesData,
    getTemplatesData,
    getUsersTemplates,
    addTemplate,
    removeTemplate,
  } = useTemplateStore();
  const { company } = useCompanyStore();
  const { user } = useUser();

  useEffect(() => {
    async function fetchTemplates() {
      await getTemplatesData();
      await getUsersTemplates();
    }
    fetchTemplates();
  }, [addTemplate, removeTemplate]);

  if (!templatesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row h-screen">
      <LeftBar className="" />
      <div className="flex flex-col w-full p-4 gap-4">
        <h1 className="text-3xl font-bold mb-4">Templates</h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {templatesData.map((template) => (
            <div key={template._id} className="card bg-base-200 shadow-sm">
              <MiniInvoice currentTemplate={template} />
              <div className="card-body flex flex-row justify-between">
                <h2 className="card-title">{template.name}</h2>
                {userTemplates?.find((t) => t._id === template._id) ? (
                  <button
                    onClick={() => removeTemplate(template._id)}
                    className="btn btn-primary btn-outline"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => addTemplate(template._id)}
                    className="btn btn-primary btn-outline"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Templates;
