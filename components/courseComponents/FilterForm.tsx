import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search } from 'lucide-react';
import { useState } from "react";
import { Badge } from "@/components/ui/badge"

import SortByAttributeButton from "@/components/ui/sortByAttribute"
import RmpSlider from "@/components/ui/rmpSlider";
import ClassFilter from "@/components/ui/classTypeFilter"
import SelectTimeComponent from "@/components/ui/selectTimeComponent"

export default function TopicFilterForm () {

  //The course search bar value.
  const [inputCourses, setInputCourses] = useState("");

  //Boolean for whether or not user wants to search for available courses or non-available courses (no idea why they would want this).
    //Maybe query for least amount of people waitlisting for this class?
    //Automatically on Open.
  const [availableCourses, setAvailableCourses] = useState(true);

  //Sets string for what the courses should be sortby.
  const [sortBy, setSortBy] = useState("");
  //Can help sort descending/ascending order.
  //const [sortAscending, setSortAscending] = useState(true);

  //Array of user chosen types of course they want to query for.
  const [courseTypeSelected, setCourseTypeSelected] = useState<string[]>([]);




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

  const categories = ["Algorithms", "Database", "Shell", "Concurrency", "JavaScript"]
  const topTags = [
    { label: "Array", count: 1894 },
    { label: "String", count: 785 },
    { label: "Hash Table", count: 689 },
    { label: "Dynamic Programming", count: 580 },
    { label: "Math", count: 575 },
    { label: "Sorting", count: 446 },
    { label: "Greedy", count: 410 },
  ]

  return (
    <form className="bg-slate-800 text-foreground p-4 rounded-md space-y-4">
      {/* Top Tags */}
      {/* <div className="flex flex-wrap gap-2 text-sm">
        {topTags.map(({ label, count }) => (
          <span
            key={label}
            className="bg-muted px-3 py-1 rounded-full cursor-pointer hover:bg-muted/70"
          >
            {label} <span className="text-muted-foreground">{count}</span>
          </span>
        ))}
        <button className="text-muted-foreground text-sm hover:text-foreground ml-2">Expand ▾</button>
      </div> */}

      {/* Categories */}
      {/* <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="rounded-full">All Topics</Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant="outline"
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div> */}

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-2">

      {/* className={`flex text-left p-1 rounded transition-colors ${
                        selected === option
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-600 text-gray-300"
                    }`} */}

        {/*Availability Selector */}
        <Select onValueChange={(value) => setAvailableCourses(value === "true")}>
          <SelectTrigger className="w-[120px] bg-[#2a2a2a] border-none font-semibold text-white focus-visible:ring-0">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className = "font-semibold bg-[#2a2a2a] border-none">
            <SelectItem className = "text-green-600 focus:bg-[#2f2f2f] focus:text-green-600" value="true">Open</SelectItem>
            <SelectItem className = "text-red-600 focus:bg-[#2f2f2f] focus:text-red-600" value="false">Full</SelectItem>
          </SelectContent>
        </Select>
        
        {/*Select time/schedule component. */}
        <SelectTimeComponent></SelectTimeComponent>

        <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full">
          Pick One
        </Button>
      </div>

      {/* Creates a border between form sections */}
      <hr className="my-6 border-t border-gray-300" />


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
        <div className = "min-w-40">
          {/*Choose how to sort the classes queried (what attribute, ascending or descending.) */}
          <SortByAttributeButton selectedFilter={sortBy} setSelectedFilter={setSortBy}></SortByAttributeButton>
        </div>
        
        {/*Choose what courseType to see. */}
        <ClassFilter courseTypeSelected = {courseTypeSelected} setCourseTypeSelected = {setCourseTypeSelected}></ClassFilter>

        {/*Choose RMP rating. */}
        <RmpSlider></RmpSlider>
          
        
      </div>

    {/* Tag Div: will map out tags of classTypes that have been selected. Can click on tag/badge to remove them.*/}
        <div className="m-3 w-full flex flex-wrap justify-start gap-2">
          {courseTypeSelected.length > 0
              ? courseTypeSelected.map(val => 
              <button onClick = {(e)=> {toggleOption(val)}} key = {`${val}Badge`}>
                <Badge className = "bg-green-500 hover:bg-red-600"> 
                  {classTypes.find(opt => opt.value === val)?.label}
                </Badge>
              </button>
              )
              : ""}
        </div>
        
        
    </form>
  )
}


