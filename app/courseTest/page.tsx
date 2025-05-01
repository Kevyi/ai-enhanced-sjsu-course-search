// 'use client';

import CourseTable from "@/components/courseComponents/CourseTable"
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";
import Navbar from "@/components/Navbar"

export default async function TestPage(){
    const sections = (await getCachedSections("spring", 2025));


    return <>

      <div>
        <Navbar scroll={false} courses = {sections}></Navbar>
        <CourseTable sections = {sections}></CourseTable>
      </div>
      

    </>
}