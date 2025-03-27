// 'use client';

import CourseTable from "@/components/courseComponents/CourseTable"
import { getCachedSections } from "@/lib/sjsu/cached";
import _rmpData from "../../public/rmp.json";
import { RMPInfo } from "@/lib/rmp/type";

export default async function TestPage(){
    const sections = (await getCachedSections("spring", 2025)).slice(0, 10);
    const rmpData: RMPInfo = _rmpData as RMPInfo;


    console.log(sections)

    return <>

      <div>
        <CourseTable sections = {sections}></CourseTable>
      </div>

    </>
}