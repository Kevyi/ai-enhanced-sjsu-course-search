import React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search } from 'lucide-react';
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge"
import { SectionWithRMP } from "@/lib/sjsu/types";

import SortByAttributeButton from "@/components/ui/sortByAttribute"
import RmpSlider from "@/components/ui/rmpSlider";
import MultiSelectFilter from "@/components/ui/multi-select-filter"
import SelectTimeComponent from "@/components/ui/selectTimeComponent"
import Combobox from "@/components/ui/comboBox"
import { parseSectionDayTimes } from "@/lib/sjsu/time";


//Query base off useState values, have a limit(timelimit) so it doesn't check after every character change.

//allCourses references a variable that holds all the courses. setCourses is a setter of useState for courses in the CourseTable, change to query.
export default function TopicFilterForm ({allCourses, setFilteredCourses, semesters, selectedSemester} : {allCourses: SectionWithRMP[], setFilteredCourses : React.Dispatch<React.SetStateAction<SectionWithRMP[]>>, semesters : [string, number][], selectedSemester: {season: string, year: number}}) {
  //The course search bar value.
  const [inputCourses, setInputCourses] = useState("");
  //The debounced course search bar value
  const [debouncedInputCourses, setDebouncedInputCourses] = useState("");

  //Boolean for whether or not user wants to search for available courses or non-available courses (no idea why they would want this).
    //Maybe query for least amount of people waitlisting for this class?
    //Automatically on Open.
  const [availableCourses, setAvailableCourses] = useState(true);

  //Sets string for what the courses should be sortby. If "No Filter," don't sort.
  const [sortBy, setSortBy] = useState("No Filter");

  //Can help sort descending/ascending order.
  //const [sortAscending, setSortAscending] = useState(true);

  //For RMP score
  const [RMPscore, setRMPScore] = useState(0);

  //For semester. Semester will be a string concat with Season + Year (string + number) = String.
  const [semester, setSemester] = useState(selectedSemester.season.charAt(0).toUpperCase() + selectedSemester.season.slice(1) + " " + selectedSemester.year);
    //Hold all the concatonated semesters.
    const allSemesters: string[] = [];
    for (const [season, count] of semesters) {
      //will make fall2025 --> Fall 2025
      allSemesters.push(season.charAt(0).toUpperCase() + season.slice(1) + " " + count);
    }

  //For the scheduling data in an array of objects.
  {/*
    [
        { day: "Mon", times: [9, 10] },
        { day: "Wed", times: [14, 15] }
    ]  
  */}
  //The number is the hours from 0-24, so 10 am = 10 and 2 pm = 14.
  const [selectedTimes, setSelectedTimes] = useState<{ day: string; times: number[] }[]>([]);


  //Array of user chosen types of course they want to query for.
  const [courseTypeSelected, setCourseTypeSelected] = useState<string[]>([]);

  const [modeTypeSelected, setModeTypeSelected] = useState<string[]>([]);

  //Hold array of all the teachers.
  // const [teachers, setTeachers] = useState<Teacher[]>([]);

  // //Intialize all the teachers inside the teacher array will all the courses given.
  // useEffect(() => {
  //   const teacherSet = new Set<string>();
  //   const uniqueTeachers: Teacher[] = [];

  //   for (const course of allCourses) {
  //     if (course.instructor && !teacherSet.has(course.instructor)) {
  //       teacherSet.add(course.instructor);
  //       uniqueTeachers.push({
  //         name: course.instructor,
  //         value: course.instructor,
  //       });
  //     }
  //   }

  //   setTeachers(uniqueTeachers);
  // }, []); // run this effect when course data changes

  //  //Teacher type
  //  type Teacher = {
  //   name: string;
  //   value: string;
  // };

  useEffect(() => {
    let filteredCourses = allCourses.filter(c => {
      const search = debouncedInputCourses.trim().toLowerCase();
      if (search !== "" && !c.section.toLowerCase().includes(search) && !c.course_title.toLowerCase().includes(search) && !c.instructor.toLowerCase().includes(search))
        return false;

      if (c.rmp && c.rmp.avgRating < RMPscore)
        return false;

      if (courseTypeSelected.length > 0 && !courseTypeSelected.includes(c.type))
        return false;

      if (modeTypeSelected.length > 0 && !modeTypeSelected.includes(c.instruction_mode))
        return false;

      const parsedDayTimes = parseSectionDayTimes(c);
      if (selectedTimes.length > 0) {
        for (const [courseDay, courseTimes] of Object.entries(parsedDayTimes)) {
          const selectedTimesOnDay = new Set(selectedTimes.find(s => s.day === courseDay)?.times);
          for (const courseTime of courseTimes) {
            const from = Math.floor(courseTime.from / 60);
            const to = Math.floor(courseTime.to / 60);
            for (let i = from; i <= to; i++) {
              if (!selectedTimesOnDay.has(i))
                return false;
            }
          }
        }
      }

      return true;
    });

    switch (sortBy) {
      case "Seats":
        filteredCourses = filteredCourses.sort((a, b) => parseInt(b.open_seats) - parseInt(a.open_seats));
        break;
      case "Rating":
        filteredCourses = filteredCourses.sort((a, b) => (b.rmp?.avgRating ?? 0) - (a.rmp?.avgRating ?? 0));
        break;
    }
    
    setFilteredCourses(filteredCourses);
  }, [allCourses, RMPscore, debouncedInputCourses, sortBy, selectedTimes, courseTypeSelected, modeTypeSelected, availableCourses]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInputCourses(inputCourses);
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputCourses]);

  //------------------------------------------------------------------------------------------------------------------------------------------------




  {/*Below are for selected courseTypes, probably should change the names.*/}
  type Option = {
    label: string;
    value: string;
  };
  
  const classTypes: Option[] = [
    { label: "Lecture", value: "LEC" },
    { label: "Lab", value: "LAB" },
    { label: "Seminar", value: "SEM" }
  ];

  const modeTypes: Option[] = [
    { label: "In Person", value: "In Person" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Online", value: "Fully Online" }
  ]

  
  //Apends or filters/remove of selected course types.
  const toggleOptionCourseType = (value: string) => {
    setCourseTypeSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  //Apends or filters/remove of selected instruction types.
  const toggleOptionInstructionType = (value: string) => {
    setModeTypeSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <form className="text-foreground p-4 pb-2 rounded-md ">

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-2">

        {/*Availability Selector */}
        <Select onValueChange={(value) => setAvailableCourses(value === "true")}>
          <SelectTrigger className="w-[120px] bg-[#2a2a2a] border-none font-semibold text-white focus-visible:ring-0 pl-2 pr-2 hover:bg-[#1a1a1a]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className = "font-semibold bg-[#2a2a2a] border-none">
            <SelectItem className = "text-green-600 focus:bg-[#2f2f2f] focus:text-green-600" value="true">Open</SelectItem>
            <SelectItem className = "text-red-600 focus:bg-[#2f2f2f] focus:text-red-600" value="false">Full</SelectItem>
          </SelectContent>
        </Select>
        
        {/*Select time/schedule component. */}
        <SelectTimeComponent selectedTimes = {selectedTimes} setSelectedTimes={setSelectedTimes}></SelectTimeComponent>

        <Combobox allSemesters = {allSemesters} semester = {semester} setSemester={setSemester}></Combobox>

      </div>

      {/* Creates a border between form sections */}
      <hr className="my-3 border-t border-gray-300" />


    {/* bg-[#2a2a2a] for slightly less black than black */}
    {/* bg-[#2f2f2f] lighter color*/}

    {/*Lower half of query */}
      <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-lg text-xl text-white">

        {/*Courses Search Input */}
        <div className="w-60 h-300 pl-2 pr-2 border rounded-3xl bg-[#2a2a2a] border-transparent flex">
          <Search className = "text-white self-center"/>
          <Input placeholder="Search Courses" className = "border-none focus-visible:ring-0 caret-white" 
              value = {inputCourses} onChange = {(e) => setInputCourses(e.target.value)}/>
        </div>
        {/* Fix resizing but when sortbyattrbiutebutton has a long tag */}
        <div className = "">
          {/*Choose how to sort the classes queried (what attribute, ascending or descending.) */}
          <SortByAttributeButton selectedFilter={sortBy} setSelectedFilter={setSortBy}></SortByAttributeButton>
        </div>
        
        {/*Choose what courseType to see. */}
        <MultiSelectFilter options={classTypes} values = {courseTypeSelected} setValues = {setCourseTypeSelected} type = {"Course"}></MultiSelectFilter>

        {/*Choose what instruction type to see. */}
        <MultiSelectFilter options={modeTypes} values = {modeTypeSelected} setValues = {setModeTypeSelected} type = {"Instruction"}></MultiSelectFilter>

        {/*Choose RMP rating. */}
        <RmpSlider RMPscore={RMPscore} setRMPScore={setRMPScore}></RmpSlider>
      </div>

    {/* Tag Div: will map out tags of classTypes that have been selected. Can click on tag/badge to remove them.*/}
    {/*can make div = h-4  */}
        <div className="w-full flex flex-wrap justify-start gap-2 h-4">
          {courseTypeSelected.length > 0
              ? courseTypeSelected.map(val => 
              <button onClick = {(e)=> {toggleOptionCourseType(val)}} key = {`${val}Badge`}>
                <Badge className = "bg-green-500 hover:bg-red-600 mt-2"> 
                  {classTypes.find(opt => opt.value === val)?.label}
                </Badge>
              </button>
              )
              : <> </>}
              {modeTypeSelected.length > 0
                  ? modeTypeSelected.map(val => 
                  <button onClick = {(e)=> {toggleOptionInstructionType(val)}} key = {`${val}Badge`}>
                    <Badge className = "bg-blue-500 hover:bg-red-600 mt-2"> 
                      {modeTypes.find(opt => opt.value === val)?.label}
                    </Badge>
                  </button>
                  )
                  : <> </>}
        </div>
        
        
    </form>
  )
}


