"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check , ArrowDown, ArrowUp, ListRestart} from "lucide-react";

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

export default function MultiSelectFilter({courseTypeSelected, setCourseTypeSelected} : {courseTypeSelected : Array<string>, setCourseTypeSelected : React.Dispatch<React.SetStateAction<Array<string>>>}) {
  const [open, setOpen] = useState(false);


  //Apends or filters/remove of selected classTypes.
  const toggleOption = (value: string) => {
    setCourseTypeSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <>
        <div className="">
            {/* <label className="m-3 block text-sm font-medium mb-1">Class Type</label> */}
            <Popover open={open} onOpenChange={setOpen}>

                <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex flex-wrap justify-start m-2 rounded-full border border-gray-700 bg-[#2a2a2a]">
                        {"Select Instruction Type"} {open ?<ArrowUp/>:<ArrowDown /> }
                    </Button>
                </PopoverTrigger>

                <PopoverContent className=" w-[200px] p-0 border-none">

                    <Command>
                        <CommandGroup className = "bg-[#2a2a2a] font-semibold text-gray-400">

                            {classTypes.map(option => (
                                <CommandItem
                                key={option.value}
                                onSelect={() => toggleOption(option.value)}
                                className={`cursor-pointer${courseTypeSelected.includes(option.value) ? "bg-[#2a2a2a]" : ""}`}
                                >
                                    <div className="mr-2 h-4 w-4 flex items-center justify-center">
                                        {courseTypeSelected.includes(option.value) && <Check className="h-4 w-4 text-green-600" />}
                                    </div>
                                    {option.label}
                                </CommandItem>
                            ))}

                            {/* Reset button */}
                            <CommandItem className = "">
                                {/* Should be the reset button for all tags. Make selected state = remove every element and close popup.*/}
                                <Button onClick = {() => {setOpen(false); setCourseTypeSelected([]);}} variant="ghost" className = "h-4 flex m-1 mb-0 ml-auto bg-transparent border-none ">
                                    Reset <ListRestart/>
                                </Button>
                            </CommandItem>

                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            
        </div>
        
    </>
  );
}