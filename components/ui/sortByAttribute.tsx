import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover";
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  import { Button } from "@/components/ui/button";
  import { ArrowUpDown, Filter, Check } from "lucide-react";
  import {useState} from "react";
  

  //Prop drill or context provider? Will need two, selectFilter and ascending/descending.
  export default function SortFilterButton({selectedFilter, setSelectedFilter} : {selectedFilter : String, setSelectedFilter: React.Dispatch<React.SetStateAction<string>>}) {
    return (
      <>
      <div className = "">
        {/* Hovering filter-button provides context for it. Can also use ToolTip Shadcn (might be better)*/}
        <HoverCard>
          <HoverCardTrigger>
            {/* The filter button */}
            <FilterButton selectedFilter = {selectedFilter} setSelectedFilter={setSelectedFilter}></FilterButton>
          </HoverCardTrigger>
          <HoverCardContent className = "w-30 p-1 pl-3 pr-3 text-sm border-black" align = "start">
            Sort by order.
          </HoverCardContent>
        </HoverCard>
      </div>
      </>
    );
  }
  


  function FilterButton({selectedFilter, setSelectedFilter} : {selectedFilter : String, setSelectedFilter: React.Dispatch<React.SetStateAction<string>>}){

      const options = ["No Filter", "Rating", "Seats"];

      return <>
      {/* Popover Sort Button */}
      <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-35 text-white rounded-full border border-gray-700 bg-[#2a2a2a] flex justify-start"
            >
            <Filter className="w-4 h-4" /> {selectedFilter}
              
            </Button>
          </PopoverTrigger>

          {/*Popover that appears when user clicks on button. Shows the sorting options.*/}
          <PopoverContent className="w-40 bg-[#2a2a2a] text-white border border-gray-700 p-2" side="bottom" align="start">
            <div className="flex flex-col space-y-1">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSelectedFilter(option)}
                    className={`flex text-left p-1 rounded transition-colors ${
                      selectedFilter === option
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-600 "
                    }`}
                    >
                    {option} {selectedFilter === option ? <Check className="w-4 h-4 mt-auto mb-auto ml-auto text-green-500" /> : ""}
                </button>
          ))}
            </div>
          </PopoverContent>
        </Popover>
      
      </>
  }





  {/* Filter Icon Button */}
  {/* <Button variant="ghost" size="icon" className="rounded-full bg-[#2a2a2a] text-white">
    <Filter className="w-4 h-4" />
  </Button> */}