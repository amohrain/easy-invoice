export const handleInvoiceGenerate = async (prompt) => {
  const response = await fetch("/api/openAI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    console.error("Error generating invoice:", response.statusText);
    return {};
  }
  const data = await response.json();
  return data.data || {};
};
