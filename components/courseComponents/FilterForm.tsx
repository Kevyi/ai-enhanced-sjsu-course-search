import React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search } from 'lucide-react';
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge"
import { SectionWithRMP } from "@/lib/sjsu/types";

import SortByAttributeButton from "@/components/ui/sortByAttribute"
import RmpSlider from "@/components/ui/rmpSlider";
import ClassFilter from "@/components/ui/classTypeFilter"
import SelectTimeComponent from "@/components/ui/selectTimeComponent"
import Combobox from "@/components/ui/comboBox"


//Query base off useState values, have a limit(timelimit) so it doesn't check after every character change.

//allCourses references a varuabke that holds all the courses. setCourses is a setter of useState for courses in the CourseTable, change to query.
export default function TopicFilterForm ({allCourses, setCourses} : {allCourses: SectionWithRMP[], setCourses : React.Dispatch<React.SetStateAction<SectionWithRMP[]>>}) {

  //The course search bar value.
  const [inputCourses, setInputCourses] = useState("");
  //The debounced course search bar value
  const [debouncedInputCourses, setDebouncedInputCourses] = useState("");

  //Boolean for whether or not user wants to search for available courses or non-available courses (no idea why they would want this).
    //Maybe query for least amount of people waitlisting for this class?
    //Automatically on Open.
  const [availableCourses, setAvailableCourses] = useState(true);

  //Sets string for what the courses should be sortby. If "Custom," don't sort.
  const [sortBy, setSortBy] = useState("Custom");

  //Can help sort descending/ascending order.
  //const [sortAscending, setSortAscending] = useState(true);

  //For RMP score
  const [RMPscore, setRMPScore] = useState(0);

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

  //Hold array of all the teachers.
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  //Intialize all the teachers inside the teacher array will all the courses given.
  useEffect(() => {
    const teacherSet = new Set<string>();
    const uniqueTeachers: Teacher[] = [];

    for (const course of allCourses) {
      if (course.instructor && !teacherSet.has(course.instructor)) {
        teacherSet.add(course.instructor);
        uniqueTeachers.push({
          name: course.instructor,
          value: course.instructor,
        });
      }
    }

    setTeachers(uniqueTeachers);
  }, []); // run this effect when course data changes

  //Console logs these useStates everytime one of these updates.
  useEffect(() => {
    console.log(RMPscore)
    console.log(debouncedInputCourses)
    console.log(sortBy)
    console.log(selectedTimes)
    console.log(courseTypeSelected)
    console.log(availableCourses)
    console.log(teachers)
  }, [RMPscore, debouncedInputCourses, sortBy, selectedTimes, courseTypeSelected, availableCourses, teachers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInputCourses(inputCourses);
    }, 500);
    return () => clearTimeout(timeout);
  }, [inputCourses]);

  //------------------------------------------------------------------------------------------------------------------------------------------------

  //Teacher type
  type Teacher = {
    name: string;
    value: string;
  };


  {/*Below are for selected courseTypes, probably should change the names.*/}
  type Option = {
    label: string;
    value: string;
  };
  
  const classTypes: Option[] = [
    { label: "Lecture", value: "lecture" },
    { label: "Lab", value: "lab" },
    { label: "Seminar", value: "seminar" },
    { label: "Online", value: "online" },
  ];


  
  //Apends or filters/remove of selected classTypes.
  const toggleOption = (value: string) => {
    setCourseTypeSelected(prev =>
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
        <ClassFilter courseTypeSelected = {courseTypeSelected} setCourseTypeSelected = {setCourseTypeSelected}></ClassFilter>

        {/*Choose RMP rating. */}
        <RmpSlider RMPscore={RMPscore} setRMPScore={setRMPScore}></RmpSlider>
      </div>

    {/* Tag Div: will map out tags of classTypes that have been selected. Can click on tag/badge to remove them.*/}
    {/*can make div = h-4  */}
        <div className="w-full flex flex-wrap justify-start gap-2 h-4">
          {courseTypeSelected.length > 0
              ? courseTypeSelected.map(val => 
              <button onClick = {(e)=> {toggleOption(val)}} key = {`${val}Badge`}>
                <Badge className = "bg-green-500 hover:bg-red-600 mt-2"> 
                  {classTypes.find(opt => opt.value === val)?.label}
                </Badge>
              </button>
              )
              : <> </>}
        </div>
        
        
    </form>
  )
}


