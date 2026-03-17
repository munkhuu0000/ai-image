import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: image },
            },
            {
              type: "text",
              text: `Чи бол хоолны мэргэжилтэн. Чиний үүрэг ирсэн зурган дээрх хоолны орц найрлагыг тодорхойлох юм. Зураг дээрх хоолны орц найрлагыг аль болох нарийвчлалтайгаар жагсааж бич. Хэрэв тодорхойгүй зүйл байвал "тодорхойгүй" гэж бич.`,
            },
          ],
        },
      ],
    });

    const ingredients =
      response.choices[0].message.content || "Could not identify ingredients.";
    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("Ingredient recognition API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to recognize ingredients", details: errorMessage },
      { status: 500 },
    );
  }
}
