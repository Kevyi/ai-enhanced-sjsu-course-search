// 'use client';

import CourseTable from "@/components/courseComponents/CourseTable"
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";
import _rmpData from "../../public/rmp.json";
import { RMPInfo } from "@/lib/rmp/type";
import Navbar from "@/components/Navbar"

export default async function TestPage(){
    const sections = (await getCachedSections("spring", 2025)).slice(0, 100);
    const rmpData: RMPInfo = _rmpData as RMPInfo;


    return <>

      <div>
        <Navbar scroll={false} courses = {sections}></Navbar>
        <CourseTable sections = {sections}></CourseTable>
      </div>
      

    </>
}