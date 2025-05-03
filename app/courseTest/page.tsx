// 'use client';

import CourseTable from "@/components/courseComponents/CourseTable"
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";
import Navbar from "@/components/Navbar"
import { Season } from "@/lib/sjsu/types";

export default async function TestPage({ searchParams }: { searchParams: Promise<{ season?: string, year?: string }> }){
    const semesters = (await getCachedAvailableSemesters());
    const latestSemester = semesters[semesters.length - 1];
    const { season, year } = await searchParams;
    const selectedSemester = {
      season: season as Season ?? latestSemester[0],
      year: year ? parseInt(year) : latestSemester[1]
    };
    const sections = (await getCachedSections(selectedSemester.season, selectedSemester.year));

    return <>

      <div>
        <Navbar scroll={false} courses = {sections}></Navbar>
        <CourseTable sections = {sections} semesters = {semesters} selectedSemester={selectedSemester}></CourseTable>
      </div>
      

    </>
}