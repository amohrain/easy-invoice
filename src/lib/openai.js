import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Use an env variable
  dangerouslyAllowBrowser: true,
});

export const handleInvoiceGenerate = async (prompt) => {
  const systemPrompt = `
  You are an intelligent assistant that generates structured invoice data in JSON format based on user input. The invoice follows a predefined structure, including business details, client details, invoice metadata, and itemized services.

### Instructions:
1. Extract relevant information from the user's text prompt and map it to the provided JSON structure.
2. Fill as many fields as possible based on the input.
3. Use intelligent parsing to categorize **items**, identifying attributes like **description**, **quantity**, **unitPrice**, **discount**, and **total**.
4. If a value is missing or unclear, leave the field blank ("") instead of guessing.
5. Ensure **totalAmount** is the sum of all **items** (unitPrice * quantity - discount).
6. Maintain proper formatting (dates in **YYYY-MM-DD** format, numbers without currency symbols).
7. Return only valid JSON output without explanations or additional text.

### **Invoice Fields**
{
    "businessName": "",
    "businessAddress": "",
    "businessEmail": "",
    "businessPhone": "",
    "businessLogo": "",
    "clientName": "",
    "clientEmail": "",
    "clientPhone": "",
    "clientAddress": "",
    "clientTaxId": "",
    "invoiceNumber": "",
    "issuedAt": "",
    "dueDate": "",
    "paymentTerms": "",
    "subtotal": "",
    "tax": "",
    "discount": "",
    "totalAmount": "",
    "notes": "",
    "paymentInstructions": "",
    "items": [
      {
        "description": "",
        "quantity": "",
        "unitPrice": "",
        "discount": "",
        "total": ""
      }
    ]
}

### **Examples**
#### **User Input:**  
"Generate an invoice for ABC Solutions billing John Doe for Web Development ($2000) and Hosting (3 months at $50). Issue date is March 20, 2025, due in 30 days."

#### **AI Output in JSON:**  
{
    "businessName": "ABC Solutions",
    "businessAddress": "",
    "businessEmail": "",
    "businessPhone": "",
    "businessLogo": "",
    "clientName": "John Doe",
    "clientEmail": "",
    "clientPhone": "",
    "clientAddress": "",
    "clientTaxId": "",
    "invoiceNumber": "",
    "issuedAt": "2025-03-20",
    "dueDate": "2025-04-19",
    "paymentTerms": "Due in 30 days",
    "subtotal": 2150,
    "tax": "",
    "discount": "",
    "totalAmount": 2150,
    "notes": "",
    "paymentInstructions": "",
    "items": [
      {
        "description": "Web Development",
        "quantity": 1,
        "unitPrice": 2000,
        "discount": 0,
        "total": 2000
      },
      {
        "description": "Hosting",
        "quantity": 3,
        "unitPrice": 50,
        "discount": 0,
        "total": 150
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
