import { auth } from "@clerk/nextjs/server";
import { getMongoUser } from "@/lib/getMongoUser";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const body = await req.json();
  const { prompt } = body;

  const systemPrompt = `
  You are an assistant that extracts structured invoice data from plain text.
  
  Rules:
  - Only output valid JSON (no explanations).
  - Use the predefined schema with these fields:
    clientName, clientEmail, clientPhone, clientAddress, clientTaxId, dueDate,
    items[{ description, quantity, rate }],
    deductions[{ description, amount, percent }],
    additions[{ description, amount, percent }].
  - Always include "items", "deductions", and "additions" arrays (even if empty).
  - Use "" for missing fields.
  - Dates: "Month Day, Year" (e.g. September 27, 2025).
  - Numbers: no currency symbols.
  - For additions/deductions:
  * If given as a percentage, put that number in "percent" (e.g. percent: 5).
  * If given as an absolute value, put that number in "amount" (e.g. amount: 200).
  * Do not mix both for the same entry.
  - Do not perform any calculations.
  - If additions/deductions have a percentage, also include it in the description (e.g. "GST @ 5%").
  `;

  // const userPrompt = `Convert this into the JSON structure: ${prompt}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    const rawContent = response.choices[0].message.content;
    const invoice = JSON.parse(rawContent);

    const { userId } = await auth();
    const user = await getMongoUser(userId);

    if (user) {
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
      if (user.invoiceCountMonth === currentMonth) {
        user.invoiceCount += 1;
      } else {
        user.invoiceCount = 1; // reset count
        user.invoiceCountMonth = currentMonth; // update to current month
      }

      await user.save();
    }

    return NextResponse.json({ message: "success", data: invoice });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
