// 'use client';

import CourseCard from "@/components/CourseCard";
import CourseTiltCard from "@/components/CourseTiltCard";
import CourseModal from "@/components/CourseModal";
import { getSections } from "@/lib/sjsu/scraper";
import { Item } from "@radix-ui/react-select";
import _rmpData from "../../public/rmp.json";
import { RMPInfo } from "@/lib/rmp/type";

export default async function TestPage(){
    const sections = (await getSections("spring", 2025)).slice(0, 10);
    const rmpData: RMPInfo = _rmpData as RMPInfo;

    return <>


        {sections.map((item) => (
        <CourseTiltCard key = {item.class_number} section = {item} rmpInfo={item.instructor_email ? rmpData[item.instructor_email]: null }></CourseTiltCard>
      ))}


        
        <CourseCard></CourseCard>
        
    
    </>
}