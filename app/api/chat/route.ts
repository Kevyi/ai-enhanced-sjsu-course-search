import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { readFileSync } from "fs";
import path from "path";
import { SectionWithRMP } from "@/lib/sjsu/types";
import { getCachedSections } from "@/lib/sjsu/cached";
import fs from "fs/promises";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatContext {
  lastCourseCode?: string;
  lastInstructor?: string;
  lastInstructorEmail?: string;
  lastCourseTitle?: string;
  lastSection?: string;
}

interface ChatRequest {
  userMessage: string;
  context?: ChatContext;
}

interface RMPInfo {
  avgRating: number;
  avgDifficulty: number;
  numRatings: number;
  wouldTakeAgainPercent: number;
  id: string;
}

interface InstructorData {
  name: string;
  rmp: RMPInfo;
}

// Load RMP and Section JSON files
const rmpDataPath = path.join(process.cwd(), "data", "rmp.json");
let rmpData: Record<string, InstructorData> = {};
try {
  const rawRmpData = await fs.readFile(rmpDataPath, "utf-8");
  rmpData = JSON.parse(rawRmpData);
  console.log("Debug: Loaded RMP data for", Object.keys(rmpData).length, "instructors");
  console.log("Debug: RMP data sample:", JSON.stringify(Object.entries(rmpData)[0], null, 2));
} catch (error) {
  console.error("Debug: Error loading RMP data:", error);
  // Continue with empty RMP data
}

const sectionsDataPath = path.resolve(process.cwd(), "data", "sections.json");
let sectionsData: SectionWithRMP[] = [];
try {
  const raw = JSON.parse(readFileSync(sectionsDataPath, "utf-8"));
  
  // Handle different possible data structures
  if (Array.isArray(raw)) {
    sectionsData = raw;
  } else if (typeof raw === 'object') {
    // If it's an object, try to extract the sections
    if (raw.sections) {
      sectionsData = Array.isArray(raw.sections) ? raw.sections : Object.values(raw.sections);
    } else {
      sectionsData = Object.values(raw);
    }
  }
  
  // Filter out invalid sections
  sectionsData = sectionsData.filter(sec => {
    if (!sec || typeof sec !== 'object') return false;
    if (!sec.section || !sec.course_title) {
      console.log("Invalid section found:", sec);
      return false;
    }
    return true;
  });
  
  console.log("Debug: Loaded sections data:", sectionsData.length, "sections");
  console.log("Debug: Sections data sample:", JSON.stringify(sectionsData[0], null, 2));
  
  // Check for CMPE courses
  const cmpeSections = sectionsData.filter(sec => 
    sec.section.toLowerCase().includes("cmpe")
  );
  console.log("Debug: Found CMPE sections:", cmpeSections.length);
  console.log("Debug: Sample CMPE sections:", cmpeSections.slice(0, 3).map(sec => ({
    section: sec.section,
    course_title: sec.course_title
  })));

  // Verify we have the expected courses
  const testCourses = ["CMPE 131", "CMPE 133", "CMPE 146"];
  testCourses.forEach(course => {
    const found = sectionsData.some(sec => 
      sec.section.toLowerCase().includes(course.toLowerCase())
    );
    console.log(`Course ${course} found:`, found);
  });
  
} catch (err) {
  console.error("Error reading sections.json:", err);
  throw new Error("Failed to load course data");
}

// In-memory cache for instructor ratings
const ratingCache: Record<string, RMPInfo | null> = {};

async function fetchInstructorRating(name: string): Promise<string> {
  if (!name || name === "TBA") return "N/A";

  if (ratingCache[name]) {
    return ratingCache[name]?.avgRating?.toString() || "N/A";
  }

  const rating = rmpData[name]?.rmp || null;
  ratingCache[name] = rating;
  return rating?.avgRating?.toString() || "N/A";
}

function analyzeCourseData(course: SectionWithRMP, instructorRating: string) {
  const analysis = {
    difficulty: "Unknown",
    workload: "Unknown",
    recommendation: "Unknown",
    notes: [] as string[]
  };

  // Analyze instructor rating
  if (instructorRating !== "N/A") {
    const rating = parseFloat(instructorRating);
    if (rating >= 4.5) {
      analysis.recommendation = "Highly recommended";
      analysis.notes.push("This instructor has excellent ratings");
    } else if (rating >= 4.0) {
      analysis.recommendation = "Recommended";
      analysis.notes.push("This instructor has good ratings");
    } else if (rating >= 3.0) {
      analysis.recommendation = "Moderately recommended";
      analysis.notes.push("This instructor has average ratings");
    } else {
      analysis.recommendation = "Not recommended";
      analysis.notes.push("This instructor has below average ratings");
    }
  }

  // Analyze course timing
  if (course.times && course.days) {
    const isMorning = course.times.includes("AM");
    const isEvening = course.times.includes("PM");
    if (isMorning) {
      analysis.notes.push("This is a morning class");
    } else if (isEvening) {
      analysis.notes.push("This is an evening class");
    }
  }

  // Analyze instruction mode
  if (course.instruction_mode) {
    if (course.instruction_mode.toLowerCase().includes("online")) {
      analysis.notes.push("This is an online course");
    } else if (course.instruction_mode.toLowerCase().includes("hybrid")) {
      analysis.notes.push("This is a hybrid course");
    }
  }

  // Analyze course type
  if (course.type) {
    if (course.type.toLowerCase().includes("lecture")) {
      analysis.notes.push("This is a lecture-based course");
    } else if (course.type.toLowerCase().includes("lab")) {
      analysis.notes.push("This is a lab course");
    }
  }

  return analysis;
}

function formatCourseInfo(course: SectionWithRMP, rmpInfo: RMPInfo): string {
  return `
Course: ${course.course_title}
Section: ${course.section}
Instructor: ${course.instructor} (${course.instructor_email})
Meeting Time: ${course.days} ${course.times}
Location: ${course.location}
Schedule: ${course.dates}
Availability: ${course.open_seats} seats

Instructor Reviews:
- Overall Rating: ${rmpInfo.avgRating || 0}/5
- Difficulty: ${rmpInfo.avgDifficulty || 0}/5
- Number of Reviews: ${rmpInfo.numRatings || 0}
- Would Take Again: ${rmpInfo.wouldTakeAgainPercent || 0}%
- RateMyProfessor ID: ${rmpInfo.id || "N/A"}
`;
}

export async function POST(req: NextRequest) {
  try {
    const { userMessage, context } = await req.json();
    
    // Extract course code from message
    const courseCodePattern = /([A-Z]{2,4})\s?-?\s?(\d{2,3})/i;
    const courseMatch = userMessage.match(courseCodePattern);
    const requestedCourseCode = courseMatch ? `${courseMatch[1]} ${courseMatch[2]}` : null;
    console.log("Debug: Requested course code:", requestedCourseCode);

    // Check if user is asking for more information about the last course
    const isFollowUp = !requestedCourseCode && context?.lastCourseCode;
    const courseCode = requestedCourseCode || context?.lastCourseCode;
    console.log("Debug: Using course code:", courseCode);

    if (!courseCode) {
      console.log("Debug: No course code found");
      return NextResponse.json({
        reply: "I need a course code to look up information. Please specify a course (e.g., 'CMPE 131').",
        context: {}
      });
    }

    // Find matching sections
    const matchingSections = sectionsData.filter(
      (section: SectionWithRMP) => {
        const sectionCourseCode = section.section.split("(")[0].trim();
        return sectionCourseCode === courseCode;
      }
    );

    if (matchingSections.length === 0) {
      return NextResponse.json({
        reply: `I couldn't find any information for ${courseCode}. Please check the course code and try again.`,
        context: {}
      });
    }

    // Get RMP info for the instructor
    const instructorEmail = matchingSections[0].instructor_email || "";
    const instructorName = matchingSections[0].instructor;
    const rmpInfo = rmpData[instructorEmail]?.rmp || rmpData[instructorName]?.rmp || {
      avgRating: 0,
      avgDifficulty: 0,
      numRatings: 0,
      wouldTakeAgainPercent: 0,
      id: "N/A"
    };

    // Format course information for the AI
    const courseInfo = formatCourseInfo(matchingSections[0], rmpInfo);

    // Create a prompt for the AI
    const prompt = `You are a helpful assistant providing information about SJSU courses. Here is the information for ${courseCode}:

${courseInfo}

User's question: ${userMessage}

Please provide a helpful and informative response based on the course information above. If the user's question is about something not covered in the information, please say so.`;

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant providing information about SJSU courses. Use the provided course information to answer questions accurately and helpfully."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;

    // Update context
    const chatContext = {
      lastCourseCode: courseCode,
      lastCourseTitle: matchingSections[0].course_title,
      lastSection: matchingSections[0].section,
      lastInstructor: matchingSections[0].instructor,
      lastInstructorEmail: matchingSections[0].instructor_email
    };

    return NextResponse.json({
      reply: aiResponse,
      context: chatContext
    });

  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
