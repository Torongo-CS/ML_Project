import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { pathogen } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in .env.local" },
        { status: 500 }
      );
    }

    if (!pathogen) {
      return NextResponse.json(
        { error: "Pathogen is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // If it's a healthy plant, we can skip complex generation and return a default
    if (pathogen.toLowerCase().includes("healthy") || pathogen.toLowerCase().includes("none")) {
        return NextResponse.json({
            severity: "None (Level 0)",
            actionDirective: "Continue standard watering and nutrient schedule. No pathological intervention required."
        });
    }

    const prompt = `You are an expert agricultural botanist.
I have a crop pathogen detected by an AI model: "${pathogen}".
Please provide a very short response in JSON format with exactly two keys:
1. "severity": The severity level (e.g., "Low (Level 1)", "Moderate (Level 2)", "High (Level 3)", or "Critical (Level 4)").
2. "actionDirective": A single sentence (maximum 25 words) with the best real-world organic or chemical treatment action.

Respond ONLY with valid JSON, nothing else.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from the response
    const jsonStr = responseText.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({
      severity: parsed.severity || "Unknown",
      actionDirective: parsed.actionDirective || "Consult agricultural expert for treatment."
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate directive" },
      { status: 500 }
    );
  }
}
