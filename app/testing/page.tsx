// "use client";
import Navbar from "@/components/Navbar"
import Home from "@/components/homePage"
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";
import CourseInformationTab from "@/components/courseComponents/CourseInformationTab";

export default async function TestPage(){
    const section = (await getCachedSections("spring", 2025))[0];
    return(
    <>
     <CourseInformationTab section = {section}></CourseInformationTab>

   </>
)}