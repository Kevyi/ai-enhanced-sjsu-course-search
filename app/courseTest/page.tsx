"use client";

import { useState, useEffect } from "react";
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";
import { SectionWithRMP } from "@/lib/sjsu/types";
import Navbar from "@/components/Navbar";
import CourseTable from "@/components/courseComponents/CourseTable";
import AiChatBox from "@/components/ui/AiChatBox";

export default function TestPage() {
  const [sections, setSections] = useState<SectionWithRMP[]>([]);
  const [semesters, setSemesters] = useState<[string, number][]>([]);
  const [selectedSemester, setSelectedSemester] = useState<{season: string, year: number}>({season: "spring", year: 2025});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const availableSemesters = await getCachedAvailableSemesters();
        console.log("Available semesters:", availableSemesters);
        setSemesters(availableSemesters);
        const latestSemester = availableSemesters[availableSemesters.length - 1];
        setSelectedSemester({season: latestSemester[0], year: latestSemester[1]});
        const sectionsData = await getCachedSections(latestSemester[0], latestSemester[1]);
        console.log("Fetched sections data:", sectionsData.length, "sections");
        if (sectionsData.length > 0) {
          console.log("Sample section:", sectionsData[0]);
        }
        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Add console logging when sections state changes
  useEffect(() => {
    console.log("TestPage sections state updated:", sections.length, "sections");
  }, [sections]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar scroll={false} courses={sections} />
      <main className="container mx-auto px-4 py-8">
        <CourseTable sections={sections} semesters={semesters} selectedSemester={selectedSemester} />
        <AiChatBox sections={sections} />
      </main>
    </div>
  );
}