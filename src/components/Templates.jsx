"use client";
import React from "react";
import ShowTemplate from "./ShowTemplate";
import Template from "@/models/template.model";

function Templates({ templatesData, template, setTemplate }) {
  return (
    <div className="h-3xl flex flex-row justify-center gap-4 w-full">
      {templatesData.map((t) => (
        <ShowTemplate
          key={t.id}
          template={template}
          templatesData={templatesData}
          setTemplate={setTemplate}
          currentTemplate={t}
        />
      ))}
    </div>
  );
}

export default Templates;
