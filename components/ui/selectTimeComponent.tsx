import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 6 AM to 7 PM


//Types for the array.
type TimeSelection = {
    day: string;
    times: number[];
  };

type Props = {
    selectedTimes: TimeSelection[];
    setSelectedTimes: React.Dispatch<React.SetStateAction<TimeSelection[]>>;
  };

export default function ScheduleSelector({selectedTimes, setSelectedTimes} : Props) {
 
    //Time and day selected in a string: "colID-rowID".
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const [isMouseDown, setIsMouseDown] = useState(false);

  //The number is the hours from 0-24, so 10 am = 10 and 2 pm = 14.
  //const [selectedTimes, setSelectedTimes] = useState<{ day: string; times: number[] }[]>([]);


  //Ensure it works outside the grid if cursor goes outside.
  useEffect(() => {
    const handleUp = () => setIsMouseDown(false);
    window.addEventListener("mouseup", handleUp);
    
    return () => window.removeEventListener("mouseup", handleUp);
  }, []);

  //Console logs the collected array of available times.
//   useEffect(() => {
//     console.log(selectedTimes);
//   }, [selectedTimes]);


    //Honestly have no idea if this code does anything.
    useEffect(() => {
        const timesMap = new Map<string, number[]>();
    
        selected.forEach((cellId) => {
        const [col, row] = cellId.split("-").map(Number);
        const day = days[col];
        const hour = hours[row];
        if (!timesMap.has(day)) timesMap.set(day, []);
        timesMap.get(day)!.push(hour);
        });
    
        const timeRanges = Array.from(timesMap.entries()).map(([day, times]) => ({
        day,
        times: times.sort((a, b) => a - b),
        }));
    
        setSelectedTimes(timeRanges);
    }, [selected]);
  

  //Toggle cell color by crossreferencing it to array of cells and adds to output array.
    //Uses set's unique set identity to do the work.
    const toggleCell = (id: string) => {
        setSelected((prev) => {
          const copy = new Set(prev);
          copy.has(id) ? copy.delete(id) : copy.add(id);
          return copy;
        });
      };
      

const resetCells = () => {
    //Resets all the cells.
    setSelected(new Set())
    //Set time map to empty.
    setSelectedTimes([]);

};

const selectAllCells = () => {

    const all = new Set<string>();
    const timesMap = new Map<string, number[]>();

    for (let col = 0; col < days.length; col++) {
        //Intialize each day into map.
        const day = days[col];
        timesMap.set(day, []);
        for (let row = 0; row < hours.length; row++) {
        all.add(`${col}-${row}`);

        //Add value to each Day's array.
        timesMap.get(day)!.push(hours[row]);
        }
    }
    //Transform map to this: an array of objects with a time array attribute.
    {/*
        [
            { day: "Mon", times: [9, 10] },
            { day: "Wed", times: [14, 15] }
        ]    
    */}
    const timeRanges = Array.from(timesMap.entries()).map(([day, times]) => ({
        day,
        times,
      }));
      

    setSelected(all);
    setSelectedTimes(timeRanges);
};


  return (
    <>
    <Popover>
        <PopoverTrigger asChild>
            <Button className="bg-[#2a2a2a] border-none font-semibold text-white focus-visible:ring-0 pl-2 pr-2">Select Time Availability 
                <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0 bg-slate-700 border-none">
            {/*Content to holds buttons to reset all or confirm all. */}
            <div className = "flex justify-end">
                <Button variant = "secondary" className = "m-2 bg-slate-400" onClick ={() => {resetCells()}}>Reset</Button>
                <Button variant = "secondary" className = "m-2 bg-slate-400" onClick ={() => {selectAllCells()}}>Add All</Button>
            </div>

            <div className="overflow-auto pr-4 pb-4">
                <div
                    className="grid select-none"
                    style={{
                    gridTemplateColumns: `80px repeat(${days.length}, 1fr)`,
                    gridTemplateRows: `40px repeat(${hours.length}, 40px)`,
                    }}
                >
                    {/* Top row for days */}
                    <div className=""></div>
                        {days.map((day, i) => (
                            <div
                                key={`day-${i}`}
                                className="text-center font-medium text-white border border-gray-700 text-xl"
                            >
                                {day}
                            </div>
                        ))}

                    {/* Time labels and grid cells */}
                    {hours.map((hour, rowIdx) => (
                        <div key={`row-${rowIdx}`} className="contents">
                            <div
                                className="text-sm text-right pr-2 text-white border border-gray-700 flex items-center justify-center"
                            >
                                {hour <= 11 ? `${hour} AM` : `${hour === 12 ? 12 : hour - 12} PM`}
                            </div>

                            {days.map((_, colIdx) => {
                            const id = `${colIdx}-${rowIdx}`;
                            const isSelected = selected.has(id);

                            return (
                                <div
                                key={id}
                                onMouseDown={() => {
                                    toggleCell(id);
                                    setIsMouseDown(true);
                                }}
                                onMouseEnter={() => isMouseDown && toggleCell(id)}
                                className={`w-full h-full border border-gray-700 cursor-pointer ${
                                    isSelected ? "bg-yellow-500" : "bg-slate-900"
                                }`}
                                />
                            );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </PopoverContent>
    </Popover>
    </>
    );

}
