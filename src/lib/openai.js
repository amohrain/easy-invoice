export const handleInvoiceGenerate = async (prompt) => {
  console.log("prmopt: ", prompt);
  const response = await fetch("/api/openAI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  console.log(response);

  if (!response.ok) {
    console.error("Error generating invoice:", response.statusText);
    return {};
  }
  const data = await response.json();
  return data.data || {};
};

export const handleItemsGenerate = async (prompt) => {
  const response = await fetch("/api/openAIItems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    console.error("Error generating items:", response.statusText);
    return "";
  }
  const data = await response.json();
  return data.data || "";
};
