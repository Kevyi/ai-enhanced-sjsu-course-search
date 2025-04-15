import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { readFileSync } from "fs";
import path from "path";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load RMP and Section JSON files
const rmpDataPath = path.resolve(process.cwd(), "rmp.json");
const rmpData = JSON.parse(readFileSync(rmpDataPath, "utf-8"));

const sectionsDataPath = path.resolve(process.cwd(), "sections.json");
let sectionsData: any[] = [];
try {
  const raw = JSON.parse(readFileSync(sectionsDataPath, "utf-8"));
  sectionsData = Array.isArray(raw) ? raw : Object.values(raw);
} catch (err) {
  console.error("Error reading sections.json:", err);
}

// In-memory cache for instructor ratings
const ratingCache: Record<string, string> = {};

async function fetchInstructorRating(name: string): Promise<string> {
  if (!name || name === "TBA") return "N/A";

  if (ratingCache[name]) {
    return ratingCache[name];
  }

  const rating = rmpData[name];
  ratingCache[name] = rating || "N/A";
  return rating || "N/A";
}

export async function POST(req: NextRequest) {
  try {
    const { userMessage, context } = await req.json();

    let messageToSend = userMessage;

    // Handle vague references with prior course context
    if (context?.lastCourseCode) {
      const vaguePhrases = [
        /\bit\b/, /\bthat\b/, /\bthis\b/, /\bdescription\b/, /\babout\b/,
        /\bprerequisite(s)?\b/, /\bschedule\b/, /\bwhen\b/
      ];
      if (vaguePhrases.some((re) => re.test(userMessage.toLowerCase()))) {
        messageToSend = `Regarding ${context.lastCourseCode}: ${userMessage}`;
      }
    }

    if (!sectionsData.length) {
      throw new Error("sectionsData is empty or invalid");
    }

    // Check if message includes a course code like CMPE 133
    const courseCodePattern = /([A-Z]{2,4})\s?-?\s?(\d{2,3})/i;
    const isCourseQuery = courseCodePattern.test(messageToSend);

    if (!isCourseQuery) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful academic assistant at San Jose State University." },
          { role: "user", content: messageToSend }
        ],
        max_tokens: 150,
      });

      const reply = response.choices[0].message.content;
      return NextResponse.json({ reply });
    }

    // Match the course based on course code
    const normalizedInput = messageToSend.toLowerCase();
    const matched = sectionsData.find(sec => {
      const section = sec.section || "";
      const courseTitle = sec.courseTitle || sec.course_title || "";
      const match = section.match(courseCodePattern) || courseTitle.match(courseCodePattern);
      if (!match) return false;
      const courseCode = `${match[1]} ${match[2]}`.toLowerCase();
      return normalizedInput.includes(courseCode);
    });

    if (matched) {
      const instructor = matched.instructor || "TBA";
      const rating = await fetchInstructorRating(instructor);

      const reply = [
        `**${matched.course_title || matched.courseTitle || "Course Title N/A"}**`,
        `**Course Code:** ${matched.section || "N/A"} (${matched.units || "?"} units)`,
        `**Instructor:** ${instructor}`,
        `**Email:** ${matched.instructor_email || "N/A"}`,
        `**Rating:** ${rating}`,
        `**Instruction Mode:** ${matched.instruction_mode || "N/A"}`,
        `**Type:** ${matched.type || "N/A"}`,
        `**Time:** ${matched.times || matched.meetingTime || "TBA"} on ${matched.days || "TBA"}`,
        `**Location:** ${matched.location || "TBA"}`,
        `**Dates:** ${matched.dates || "TBA"}`,
        `**Seats Available:** ${matched.open_seats || "?"}`,
        matched.section_url ? `**Section Info:** [Click here](${matched.section_url})` : null,
        matched.notes ? `**Notes:** ${matched.notes}` : null,
      ].filter(Boolean).join("\n");

      return NextResponse.json({ reply });
    }

    // Fallback: Return top 10 course previews
    const sectionInfoPromises = sectionsData.slice(0, 10).map(async (sec) => {
      const instructor = sec.instructor || "TBA";
      const rating = await fetchInstructorRating(instructor);

      return [
        `Course: ${sec.courseTitle || "Unknown"} (${sec.units || "?"} units)`,
        `Time: ${sec.times || sec.meetingTime || "TBA"} on ${sec.days || "TBA"}`,
        `Instructor: ${instructor}`,
        `Rating: ${rating}`,
      ].join("\n");
    });

    const sectionInfo = (await Promise.all(sectionInfoPromises)).join("\n\n");

    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant with access to real SJSU course data. Use the following list of real course titles, units, meeting times, instructors, and their ratings to help the student plan their schedule:\n\n${sectionInfo}`,
        },
        { role: "user", content: messageToSend },
      ],
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
