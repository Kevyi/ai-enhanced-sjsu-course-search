import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { RMPInfo, Season, SectionWithRMP } from "@/lib/sjsu/types";
import { getCachedSections } from "@/lib/sjsu/cached";

// Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

function formatCourseInfo(course: SectionWithRMP, rmpInfo: RMPInfo, description: string): string {
  const rmpUrl = rmpInfo.legacyId !== "N/A" ? `https://www.ratemyprofessors.com/professor/${rmpInfo.legacyId}` : "N/A";
  
  return `
Course: ${course.course_title}
Section: ${course.section}
Instructor: ${course.instructor} (${course.instructor_email})
Meeting Time: ${course.days} ${course.times}
Location: ${course.location}
Schedule: ${course.dates}
Availability: ${course.open_seats} seats

Course Description:
${description}

Instructor Reviews:
- Overall Rating: ${rmpInfo.avgRating || 0}/5
- Difficulty: ${rmpInfo.avgDifficulty || 0}/5
- Number of Reviews: ${rmpInfo.numRatings || 0}
- Would Take Again: ${rmpInfo.wouldTakeAgainPercent || 0}%
- RateMyProfessor URL: ${rmpUrl}
`;
}

export async function POST(req: NextRequest) {
  try {
    const { userMessage, context, season, year }: { 
      userMessage: string, 
      context: {
        lastCourseCode: string,
        lastInstructor: string,
        lastInstructorEmail: string,
      },
      season: Season,
      year: number
    } = await req.json();
    console.log("Debug: Received message:", userMessage);
    console.log("Debug: Current context:", context);

    const sectionsData = await getCachedSections(season, year);

    // Check if this is a follow-up question about a course
    const isFollowUpQuestion = userMessage.toLowerCase().includes("this course") || 
                              userMessage.toLowerCase().includes("tell me more") ||
                              userMessage.toLowerCase().includes("what about it") ||
                              userMessage.toLowerCase().includes("can you explain") ||
                              userMessage.toLowerCase().includes("what does it cover");

    // Extract course code from the message or use context
    let courseCode = "";
    if (isFollowUpQuestion && context?.lastCourseCode) {
      courseCode = context.lastCourseCode;
      console.log("Debug: Using course code from context for follow-up:", courseCode);
    } else {
      const courseCodeMatch = userMessage.match(/([A-Za-z]+\s*\d+)/);
      if (courseCodeMatch) {
        courseCode = courseCodeMatch[0];
      } else if (context?.lastCourseCode) {
        courseCode = context.lastCourseCode;
        console.log("Debug: Using course code from context:", courseCode);
      } else {
        return NextResponse.json({
          reply: "I need a course code to look up information. Please specify a course (e.g., 'CMPE 131').",
          context: {}
        });
      }
    }

    // Find matching sections
    console.log("Debug: Looking for course:", courseCode);
    console.log("Debug: Total sections:", sectionsData.length);
    
    // Normalize the course code by removing extra spaces, converting to uppercase, and handling section numbers
    const normalizedCourseCode = courseCode.replace(/\s+/g, ' ').trim().toUpperCase();
    
    const matchingSections = sectionsData.filter(
      (section: SectionWithRMP) => {
        // Extract the course code from the section (e.g., "CMPE 146" from "CMPE 146 (Section 01)")
        const sectionCourseCode = section.section.split("(")[0].trim();
        const isMatch = sectionCourseCode === normalizedCourseCode;
        if (isMatch) {
          console.log("Debug: Found match:", {
            requested: normalizedCourseCode,
            section: sectionCourseCode,
            fullSection: section.section,
            courseTitle: section.course_title,
            description: section.description
          });
        }
        return isMatch;
      }
    );

    console.log("Debug: Found matching sections:", matchingSections.length);
    if (matchingSections.length > 0) {
      console.log("Debug: First matching section:", {
        section: matchingSections[0].section,
        courseTitle: matchingSections[0].course_title,
        instructor: matchingSections[0].instructor,
        description: matchingSections[0].description
      });
    }

    // Try to get the course description from the section or fetch it from the database
    let courseDescription = matchingSections[0]?.description;
    if (!courseDescription) {
      console.log("Debug: No description in section data");
      courseDescription = "No course description available.";
    }
    
    if (matchingSections.length > 0) {
      // Format course details
      const courseDetails = matchingSections.map(section => `
Section ${section.section.split("(")[1].replace(")", "")}:
- Instructor: ${section.instructor}
- Location: ${section.location}
- Days: ${section.days}
- Time: ${section.times}
- Dates: ${section.dates}
- Available Seats: ${section.open_seats}
${section.rmp ? `- RateMyProfessor Rating: ${section.rmp.avgRating}/5 (${section.rmp.numRatings} ratings)` : ''}
`).join('\n');

      // Check if the user is asking for a course summary/description
      const isAskingForSummary = isFollowUpQuestion || 
                                userMessage.toLowerCase().includes("summary") || 
                                userMessage.toLowerCase().includes("description") ||
                                userMessage.toLowerCase().includes("what is") ||
                                userMessage.toLowerCase().includes("about") ||
                                userMessage.toLowerCase().includes("teach") ||
                                userMessage.toLowerCase().includes("learn") ||
                                userMessage.toLowerCase().includes("tell me about");

      if (isAskingForSummary) {
        // Create a prompt for ChatGPT to explain the course
        const prompt = `You are a helpful assistant providing information about SJSU courses. Here is information about ${normalizedCourseCode}:

Course Title: ${matchingSections[0].course_title}
${courseDescription !== "No course description available." ? `Course Description: ${courseDescription}` : ""}

Based on the course title "${matchingSections[0].course_title}", please provide a detailed explanation of what this course covers. Focus on:
1. What students will learn in this course
2. What skills they will develop
3. How this course fits into their academic journey
4. Any important prerequisites or requirements

If no official description is provided, use your knowledge of computer engineering courses to provide an accurate explanation based on the course title. Make it clear when you are inferring information from the course title rather than using an official description.`;

        // Get response from OpenAI
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant providing information about SJSU courses. Your role is to explain courses in a student-friendly way while maintaining accuracy. You have expertise in computer engineering and can provide accurate information about CMPE courses even when the official description is not available.`
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

        // For follow-up questions, only return the summary
        if (isFollowUpQuestion) {
          return NextResponse.json({
            reply: completion.choices[0].message.content,
            context: {
              lastCourseCode: normalizedCourseCode,
              lastCourseTitle: matchingSections[0].course_title
            }
          });
        }

        // For initial course queries, show both details and summary
        return NextResponse.json({
          reply: `Here are the available sections for ${normalizedCourseCode}:\n\n${courseDetails}\n\nCourse Summary:\n${completion.choices[0].message.content}`,
          context: {
            lastCourseCode: normalizedCourseCode,
            lastCourseTitle: matchingSections[0].course_title
          }
        });
      } else {
        // Just show the course details
        return NextResponse.json({
          reply: `Here are the available sections for ${normalizedCourseCode}:\n\n${courseDetails}\n\nIf you'd like to know more about what this course covers, you can ask for a course summary or description.`,
          context: {
            lastCourseCode: normalizedCourseCode,
            lastCourseTitle: matchingSections[0].course_title
          }
        });
      }
    }

    // If no sections are found, provide a more helpful response
    return NextResponse.json({
      reply: `I couldn't find any information for ${normalizedCourseCode}. This could mean:\n1. The course code might be incorrect\n2. The course might not be offered this semester\n3. The course might have a different code\n\nPlease check the course code and try again. You can also try searching for similar courses in the same department.`,
      context: {}
    });

  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
