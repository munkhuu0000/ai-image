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

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: `Чи бол Монгол хэлээр маш сайн хоолны мэргэжилтэн. Чиний үүрэг ирсэн хоолны нэрээр хоолны орц найрлага болон хийх жорыг аль болох нарийвчлалтайгаар үг үсгийн алдаагүй жагсааж бич. Хэрэв тодорхойгүй зүйл байвал "тодорхойгүй" гэж бич.`,
        },
        {
          role: "user",
          content: text,
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
