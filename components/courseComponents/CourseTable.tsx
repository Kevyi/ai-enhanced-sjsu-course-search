"use client";
import { useState, useEffect } from "react";
import { SectionWithRMP } from "@/lib/sjsu/types";
import CourseTiltCard from "./CourseTiltCard"
import FilterForm from "@/components/courseComponents/FilterForm"
import TablePagination from "@/components/ui/courseTablePagination"



export default function CourseTable({sections} : {sections : SectionWithRMP[]}){

    //Kind of bad to have this reNamed from sections to courses. 
        //Only way to update the renders of each course throughout.

    //const sections = (await getCachedSections("spring", 2025)).slice(0, 10); slice it

    //Original array with all the sections.
    const allSections = sections;

    //Queried sections.
    const [courses, setCourses] = useState(sections);
    //How many courses per page
    const coursesPerPage = 6;
    //What the website will see
    const [viewCourses, setViewCourses] = useState(sections);

    const [paginationIndex, setPaginationIndex] = useState(1);

    //Set what page to be viewed depending on paginationIndex that is incremented/decremented from pagination component.
    useEffect(() =>{

        //Go to next page of array.
        const coursesArray = sections.slice(coursesPerPage * (paginationIndex -1), coursesPerPage * paginationIndex);

        setViewCourses(coursesArray);
        console.log(sections)
    }, [paginationIndex])

    return <>
    <div className = "flex flex-col justify-center items-center">

        <div className = "border border-borderLines bg-gradient-to-b from-slate-900 to-main3 flex-col max-w-5xl min-w-xl">

            <FilterForm allCourses = {allSections} setCourses = {setCourses}></FilterForm>

            <div className = "flex flex-row min-h-screen flex-wrap justify-center p-10 pt-5">
                {viewCourses.map((item) => (
                    <CourseTiltCard key = {item.class_number} section = {item} inShoppingCart = {false}></CourseTiltCard>
                ))}
            </div>  
        </div>
         
         <div>
            {/*Holds the pagination bar for the table */}
            <TablePagination paginationIndex={paginationIndex} setPaginationIndex={setPaginationIndex} maxPagination = {Math.ceil(courses.length / coursesPerPage)}></TablePagination>
         </div>
    </div>


    </>

}

