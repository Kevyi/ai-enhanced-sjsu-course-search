"use client";
import { useState } from "react";
import { SectionWithRMP } from "@/lib/sjsu/types";
import CourseTiltCard from "./CourseTiltCard"
import { Input } from "@/components/ui/input"
import FilterSideBar from "@/components/courseComponents/FilterSideBar"



export default function CourseTable({sections} : {sections : SectionWithRMP[]}){

    //Kind of bad to have this reNamed from sections to courses. 
        //Only way to update the renders of each course throughout.
    const [courses, setCourses] = useState(sections);

    return <>
    <div className = "flex flex-row">
        {/* Outside container for filter */}
        {/* <div className = "bg-main1 p-10 m-10 text-center text-main min-w-lg">
            <FilterSideBar></FilterSideBar>
           
        </div> */}
        <FilterSideBar></FilterSideBar>

        <div className = "border border-borderLines bg-gradient-to-b from-slate-900 to-main3 flex-col max-w-5xl min-w-xl">

            <div className = "flex flex-row min-h-screen flex-wrap justify-center p-10">
                {courses.map((item) => (
                    <CourseTiltCard key = {item.class_number} section = {item}></CourseTiltCard>
                ))}
            </div>  
        </div>
         
    </div>
    
    </>

}

