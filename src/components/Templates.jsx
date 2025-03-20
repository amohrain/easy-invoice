"use client";
import React from "react";
import ShowTemplate from "./ShowTemplate";
import Template from "@/models/template.model";

function Templates({ templatesData, template, setTemplate }) {
  return (
    <div className="flex flex-row gap-4 w-full">
      {templatesData.map((t) => (
        <ShowTemplate
          key={t.id}
          template={template}
          setTemplate={setTemplate}
          currentTemplate={t}
        />
      ))}
    </div>
  );
}

export default Templates;
