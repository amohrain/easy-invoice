import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const body = await req.json();
  const { prompt } = body;

  console.log(prompt);

  const systemPrompt = `
        You are an intelligent assistant that generates structured invoice items data in JSON format based on user input. The invoice items follows a predefined structure, including description, quantity and rate.
      
      ### Instructions:
      1. If no quantity is given assume it to be 1.
      
      ### Output Structure:
      {
        "items": [
          {
            "description": "",
            "quantity": "",
            "rate": "",
          }
        ],
      }`;

  const userPrompt = `Convert this into the JSON structure: ${prompt}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    console.log(response);
    const rawContent = response.choices[0].message.content;
    const items = JSON.parse(rawContent);
    console.log("items: ", items);
    return NextResponse.json({ message: "success", data: items.items });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
