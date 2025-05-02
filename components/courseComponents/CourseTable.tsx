"use client";
import { useState, useEffect } from "react";
import { SectionWithRMP } from "@/lib/sjsu/types";
import CourseTiltCard from "./CourseTiltCard"
import FilterForm from "@/components/courseComponents/FilterForm"
import TablePagination from "@/components/ui/courseTablePagination"



export default function CourseTable({sections, semesters} : {sections : SectionWithRMP[], semesters : [string, number][]}){

    //Kind of bad to have this reNamed from sections to courses. 
        //Only way to update the renders of each course throughout.

    //Queried sections.
    const [filteredCourses, setFilteredCourses] = useState(sections);
    //How many courses per page
    const coursesPerPage = 6;
    const [paginationIndex, setPaginationIndex] = useState(1);

    return <>
    <div className = "flex flex-col justify-center items-center">

        <div className = "border border-borderLines bg-gradient-to-b from-slate-900 to-main3 flex-col max-w-5xl min-w-xl">

            <FilterForm allCourses = {sections} setFilteredCourses = {setFilteredCourses} semesters = {semesters}></FilterForm>

            <div className = "flex flex-row min-h-screen flex-wrap justify-center p-10 pt-5">
                {filteredCourses.slice(coursesPerPage * (paginationIndex -1), coursesPerPage * paginationIndex).map((item) => (
                    <CourseTiltCard key = {item.class_number} section = {item} inShoppingCart = {false}></CourseTiltCard>
                ))}
            </div>  
        </div>
         
         <div>
            {/*Holds the pagination bar for the table */}
            <TablePagination paginationIndex={paginationIndex} setPaginationIndex={setPaginationIndex} maxPagination = {Math.ceil(filteredCourses.length / coursesPerPage)}></TablePagination>
         </div>
    </div>


    </>

}

