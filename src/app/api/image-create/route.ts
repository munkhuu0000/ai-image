import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    const translation = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Translate the following text to English. Return only translated text, nothing else: ${text}`,
        },
      ],
    });
    const englishText = translation.choices[0].message.content || text;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A professional food photography of ${englishText}`,
      n: 1,
      size: "1024x1024",
    });

    const imageURL = response.data?.[0].url || "Could not generate image.";
    return NextResponse.json({ imageURL });
  } catch (error) {
    console.error("Image generation API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate image", details: errorMessage },
      { status: 500 },
    );
  }
}
