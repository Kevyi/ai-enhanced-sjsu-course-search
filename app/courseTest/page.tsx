// 'use client';

import CourseTable from "@/components/courseComponents/CourseTable"
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";
import Navbar from "@/components/Navbar"

export default async function TestPage(){
    const sections = (await getCachedSections("spring", 2025));
    const semesters = (await getCachedAvailableSemesters())

    return <>

      <div>
        <Navbar scroll={false} courses = {sections}></Navbar>
        <CourseTable sections = {sections} semesters = {semesters}></CourseTable>
      </div>
      

    </>
}