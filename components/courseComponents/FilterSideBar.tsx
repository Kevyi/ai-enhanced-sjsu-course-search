"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check , ArrowDown, ListRestart} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import RmpSlider from "@/components/ui/rmpSlider";

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

export default function MultiSelectFilter() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  //Apends or filters of selected classTypes.
  const toggleOption = (value: string) => {
    setSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <>
        <div className="max-w-sm p-5 border-t-2 border-slate-800 bg-slate-900">
            {/* <label className="m-3 block text-sm font-medium mb-1">Class Type</label> */}
            <Popover open={open} onOpenChange={setOpen}>

                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex flex-wrap justify-start m-2">
                        {"Select Instruction Type"} <ArrowDown />
                    </Button>
                </PopoverTrigger>

                {/* Tag Div */}
                <div className="m-3 w-full flex flex-wrap justify-start gap-2">
                    {selected.length > 0
                        ? selected.map(val => 
                        <Badge className = "bg-green-500 hover:bg-green-600" key = {`${val}Badge`}> {classTypes.find(opt => opt.value === val)?.label} </Badge>)
                        : ""}
                </div>

                <PopoverContent className=" w-[200px] p-0">
                    {/* Should be the reset button for all tags. Make selected state = remove every element and close popup.*/}
                    <Button onClick = {() => {setOpen(false); setSelected([]);}} variant="secondary" className = "flex m-1 mb-0 ml-auto bg-inherit">
                        Reset <ListRestart/>
                    </Button>

                    <Command>
                        <CommandGroup>
                        {classTypes.map(option => (
                            <CommandItem
                            key={option.value}
                            onSelect={() => toggleOption(option.value)}
                            className={`cursor-pointer ${selected.includes(option.value) ? "bg-blue-100" : "bg-white"}`}
                            >
                            
                            <div className="mr-2 h-4 w-4 flex items-center justify-center">
                                {selected.includes(option.value) && <Check className="h-4 w-4" />}
                            </div>
                            
                            {option.label}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <CourseFilterForm></CourseFilterForm>
        </div>
        
    </>
  );
}

function CourseFilterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to filter courses here
  };

  return (
    <>
    
    <Card className="max-w-sm mx-auto shadow-md pt-4 pb-0 rounded-2xl">
      <CardContent> 
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/*Search Bar for classes*/}
          <div className = "col-span-2">
            <Label htmlFor="classSearch">Class Search</Label>
            <Input id="classSearch" placeholder="Search" />
          </div>
          
          {/*Semester Type*/}
          <div>
            <Label htmlFor="semesterType">Semester</Label>
            <Select>
              <SelectTrigger id="semesterType">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring2024">Spring 2024</SelectItem>
                <SelectItem value="fall2024">Fall 2024</SelectItem>

              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Input id="teacher" placeholder="Enter Teacher w/ auto completion" />
          </div>

          <div>
            <Label htmlFor="time">Time & Days</Label>
            <Input id="time" placeholder="e.g. 10:00 AM - 12:00 PM" />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. Room 204 or Online" />
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Select>
              <SelectTrigger id="availability">
                <SelectValue placeholder="Open" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Open</SelectItem>
                <SelectItem value="fall2024">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className = "col-start-1">
            <Label htmlFor="rmpScore">Rate my Professor:</Label>
            <RmpSlider></RmpSlider>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button className = "max-w-xs" type="submit">Apply Filters</Button>
          </div>
          
        
        </form>
      </CardContent>
    </Card>
    </>
  );
}


