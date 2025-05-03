import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { SectionWithRMP } from "@/lib/sjsu/types";

const sectionsDataPath = path.resolve(process.cwd(), "data", "sections.json");

export async function GET(req: NextRequest) {
  try {
    console.log("Debug: Reading sections data from:", sectionsDataPath);
    const raw = JSON.parse(readFileSync(sectionsDataPath, "utf-8"));
    console.log("Debug: Raw sections data type:", typeof raw);
    console.log("Debug: Raw sections data length:", Array.isArray(raw) ? raw.length : Object.keys(raw).length);

    const sectionsData: SectionWithRMP[] = Array.isArray(raw) ? raw : Object.values(raw);
    console.log("Debug: Processed sections data length:", sectionsData.length);

    // Log a sample of the data to verify it's the correct data
    const sampleSection = sectionsData.find(sec => sec.section.includes("CMPE 131"));
    console.log("Debug: Sample CMPE 131 section:", sampleSection);

    return NextResponse.json(sectionsData);
  } catch (error) {
    console.error("Error in sections API:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
} 