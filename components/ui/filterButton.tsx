import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover";
  import { Button } from "@/components/ui/button";
  import { ArrowUpDown, Filter, Check } from "lucide-react";
  import {useState} from "react";
  
  export default function SortFilterButton() {
    const [selected, setSelected] = useState("Custom");
    const options = ["Custom", "Rating", "Seats", "Popular"];

    return (
      <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-lg">
        {/* Popover Sort Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-white rounded-full border border-gray-700 bg-[#2a2a2a]"
            >
              <Filter className="w-4 h-4" /> {selected}

            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#2a2a2a] text-white border border-gray-700 p-2" side="bottom" align="start">
            <div className="flex flex-col space-y-1">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={`flex text-left p-1 rounded transition-colors ${
                        selected === option
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-600 text-gray-300"
                    }`}
                    >
                    {option} {selected === option ? <Check className="w-4 h-4 mt-auto mb-auto ml-auto text-green-500" /> : "false"}
                </button>
          ))}
            </div>
          </PopoverContent>
        </Popover>
  
        
  
        {/* Filter Icon Button */}
        <Button variant="ghost" size="icon" className="rounded-full bg-[#2a2a2a] text-white">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    );
  }
  