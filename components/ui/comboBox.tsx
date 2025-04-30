"use client"

import React, { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

//Teacher type
type Teacher = {
    name: string;
    value: string;
};

export default function Combobox({teachers} : {teachers : Teacher[]}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-white bg-[#2a2a2a] hover:bg-[#1a1a1a]"
        >
          {value
            ? teachers.find((teacher : Teacher) => teacher.value === value)?.name
            : "Select Teacher..."}
          <ChevronsUpDown className="opacity-50 " />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0 border-none rounded-lg">
        <Command className = "bg-[#2a2a2a] text-white">
          <CommandInput placeholder="Search Teacher..." className="h-9 text-white" />
          <CommandList className = "[scrollbar-width:none]">
            <CommandEmpty>Search Teacher.</CommandEmpty>
            <CommandGroup className ="">
              {teachers.map((teacher : Teacher) => (
                <CommandItem
                  key={teacher.value}
                  value={teacher.value}
                  className = "text-white font-semibold border-none p-2 data-[selected=true]:bg-[#313131] data-[selected=true]:text-white"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {teacher.name}
                  <Check
                    className={cn(
                      "text-green-500",
                      "ml-auto",
                      value === teacher.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
