import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: `Чи бол хоол, жор, орц найрлагын чиглэлээр мэргэшсэн туслах AI юм. Товч, найрсаг хариулт өг. Монгол хэлээр хариулна уу.`,
        },
        ...messages.map((msg: Message) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    });

    const message =
      response.choices[0].message.content ||
      "Sorry, I couldn't generate a response. Please try again.";
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate response", details: errorMessage },
      { status: 500 },
    );
  }
}
