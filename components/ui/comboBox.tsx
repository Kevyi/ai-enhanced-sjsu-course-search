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

export default function Combobox({
  allSemesters,
  semester,
  setSemester,
}: {
  allSemesters: string[];
  semester: string;
  setSemester: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-white bg-[#2a2a2a] hover:bg-[#1a1a1a]"
        >
          {semester ? semester : "Select semester..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0 border-none rounded-lg">
        <Command className="bg-[#2a2a2a] text-white">
          <CommandInput
            placeholder="Search semester..."
            className="h-9 text-white"
          />
          <CommandList className="[scrollbar-width:none]">
            <CommandEmpty>No semesters found.</CommandEmpty>
            <CommandGroup>
              {allSemesters.map((s) => (
                <CommandItem
                  key={s}
                  value={s}
                  className="text-white font-semibold border-none p-2 data-[selected=true]:bg-[#313131] data-[selected=true]:text-white"
                  onSelect={(currentValue) => {
                    setSemester(currentValue === semester ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {s}
                  <Check
                    className={cn(
                      "text-green-500 ml-auto",
                      semester === s ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
