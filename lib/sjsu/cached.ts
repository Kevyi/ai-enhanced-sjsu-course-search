"use server";

import { unstable_cache } from "next/cache";
import { SectionWithRMP } from "./types";

const PART_LENGTH = 2000;

const getSectionsPart = unstable_cache(
  async (term: string, year: number, part: number) => {
    try {
      console.log("Debug: Fetching sections part", part, "for term", term, "year", year);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const url = `${baseUrl}/api/sections?term=${term}&year=${year}`;
      console.log("Debug: Fetching from URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Debug: Failed to fetch sections:", response.status, response.statusText);
        throw new Error(`Failed to fetch sections: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Debug: Received sections data length:", data.length);
      return data.slice(part * PART_LENGTH, (part + 1) * PART_LENGTH);
    } catch (error) {
      console.error("Debug: Error in getSectionsPart:", error);
      throw error;
    }
  },
  ["sections-part"],
  { revalidate: 3600 }
);

const getSectionsSize = unstable_cache(
  async (term: string, year: number) => {
    try {
      console.log("Debug: Fetching sections size for term", term, "year", year);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const url = `${baseUrl}/api/sections?term=${term}&year=${year}`;
      console.log("Debug: Fetching from URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Debug: Failed to fetch sections size:", response.status, response.statusText);
        throw new Error(`Failed to fetch sections: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Debug: Received sections size:", data.length);
      return data.length;
    } catch (error) {
      console.error("Debug: Error in getSectionsSize:", error);
      throw error;
    }
  },
  ["sections-size"],
  { revalidate: 3600 }
);

export async function getCachedSections(term: string, year: number): Promise<SectionWithRMP[]> {
  try {
    console.log("Debug: Getting cached sections for term", term, "year", year);
    const size = await getSectionsSize(term, year);
    console.log("Debug: Total sections size:", size);
    
    const parts = await Promise.all(
      Array(Math.ceil(size / PART_LENGTH))
        .fill(undefined)
        .map((_, i) => getSectionsPart(term, year, i))
    );
    
    const sections = parts.flat();
    console.log("Debug: Total sections after combining parts:", sections.length);
    return sections;
  } catch (error) {
    console.error("Debug: Error in getCachedSections:", error);
    return [];
  }
}

// Clear cache function for testing or manual cache invalidation
export async function clearCache() {
  // This is a no-op since we're using Next.js's built-in caching
  return;
}
