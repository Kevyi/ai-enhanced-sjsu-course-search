"use client";
import { useState, useEffect } from "react";
import { SectionWithRMP } from "@/lib/sjsu/types";
import CourseTiltCard from "./CourseTiltCard"
import { Input } from "@/components/ui/input"
import FilterSideBar from "@/components/courseComponents/FilterSideBar"
import FilterForm from "@/components/courseComponents/FilterForm"
import TablePagination from "@/components/ui/courseTablePagination"



export default function CourseTable({sections} : {sections : SectionWithRMP[]}){

    //Kind of bad to have this reNamed from sections to courses. 
        //Only way to update the renders of each course throughout.

    //const sections = (await getCachedSections("spring", 2025)).slice(0, 10); slice it
    const [courses, setCourses] = useState(sections);

    const [paginationIndex, setPaginationIndex] = useState(1);
    const [maxPagination, setMaxPagination] = useState(3);

    useEffect(() => {

        //query sections here. Index 1 = first 10, index 2 = next 10 etc.
            //Should be an index limit tho.
        
        //HAVE TO ROUND UP no matter what. EVEN if 0, round up to 1.
        //setMaxPagination(courses.length/10);

      }, [paginationIndex]);





    return <>
    <div className = "flex flex-col justify-center items-center">

        <FilterForm></FilterForm>

        {/* Original vertical filter table. */}
        <FilterSideBar></FilterSideBar>

        <div className = "border border-borderLines bg-gradient-to-b from-slate-900 to-main3 flex-col max-w-5xl min-w-xl">

            <div className = "flex flex-row min-h-screen flex-wrap justify-center p-10">
                {courses.map((item) => (
                    <CourseTiltCard key = {item.class_number} section = {item}></CourseTiltCard>
                ))}
            </div>  
        </div>
         
         <div>
            {/*Holds the pagination bar for the table */}
            <TablePagination paginationIndex={paginationIndex} setPaginationIndex={setPaginationIndex} maxPagination = {maxPagination}></TablePagination>
         </div>
    </div>
    
    </>

}

