import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { MongoClient } from "mongodb";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MongoDB setup
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
  try {
    const { userMessage } = await req.json();

    await client.connect();
    const db = client.db("sjsuCourses");
    const sections = await db.collection("sections").find().limit(10).toArray();

    // Format section data to include course, units, time, instructor
    const sectionInfo = sections.map(sec => {
      return [
        `Course: ${sec.courseTitle || "Unknown"} (${sec.units || "?"} units)`,
        `Time: ${sec.meetingTime || "TBA"}`,
        `Instructor: ${sec.instructor || "TBA"}`,
        `Rating: ${sec.rating || "N/A"}`,
      ].join("\n");
    }).join("\n\n");

    // ⏳ Optional: Add a slight delay so frontend can show "Typing..."
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant with access to real SJSU course data. Use the following list of real course titles, units, meeting times, and instructors to help the student plan their schedule:\n\n${sectionInfo}`,
        },
        { role: "user", content: userMessage },
      ],
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  } finally {
    await client.close();
  }
}
