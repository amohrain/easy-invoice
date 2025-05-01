import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Use an env variable
  dangerouslyAllowBrowser: true,
});

export const handleInvoiceGenerate = async (prompt) => {
  const systemPrompt = `
  You are an intelligent assistant that generates structured invoice data in JSON format based on user input. The invoice follows a predefined structure, including business details, client details, invoice metadata, itemized services, and optional additions and deductions.

### Instructions:
1. Extract relevant information from the user's text prompt and map it to the JSON structure.
2. Fill as many fields as possible based on the input.
3. Use intelligent parsing to categorize **items**, identifying attributes like **description**, **quantity**, **rate**, and **total**.
4. Always include the **additions** and **deductions** arrays in your output, even if empty.
5. If a value is missing or unclear, leave the field blank ("") or use empty arrays where appropriate.
7. Maintain proper formatting (dates in **Month Date, Year** format, numbers without currency symbols).
8. Return only valid JSON output without explanations or additional text.
9. Enter fields businessName, businessAddress, businessEmail and businessPhone if and only if there appear to be more than two parties.

### Output Structure:
{
  "businessName": "",
  "businessAddress": "",
  "businessEmail": "",
  "businessPhone": "",
  "clientName": "",
  "clientEmail": "",
  "clientPhone": "",
  "clientAddress": "",
  "clientTaxId": "",
  "issuedAt": "",
  "dueDate": "",
  "notes": "",
  "currencySymbol": "",
  "paymentInstructions": "",
  "items": [
    {
      "description": "",
      "quantity": "",
      "rate": "",
      "total": ""
    }
  ],
  "deductions": [
    {
      "description": "",
      "amount": "",
      "percent": ""
    }
  ],
  "additions": [
    {
      "description": "",
      "amount": "",
      "percent": ""
    }
  ]
}`;

  const userPrompt = `Convert this into the JSON structure: ${prompt}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    console.log(response);
    const rawContent = response.choices[0].message.content;
    const invoice = JSON.parse(rawContent);
    console.log("invoice: ", invoice);
    return invoice;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return {};
  }
};
