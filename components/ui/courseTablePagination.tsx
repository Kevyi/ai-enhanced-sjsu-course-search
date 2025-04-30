import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

import { useState, useEffect } from "react";

export default function CourseTablePagination({paginationIndex, setPaginationIndex, maxPagination} : {paginationIndex: number, setPaginationIndex: React.Dispatch<React.SetStateAction<number>>, maxPagination : number}){
    
    
    const scrollToTop = () => {
        window.scrollTo({
          top: -10,
          behavior: 'smooth', // smooth scroll animation
        });
      };

    return(<>

        {/*Won't keep previous pages, first button will always be current page. Change later? */}

    <Pagination className = "bg-slate-700" >
        <PaginationContent>
            {/*Back one.*/}
            <PaginationItem>
                <PaginationPrevious className = "cursor-pointer hover:bg-slate-400" onClick={() => paginationIndex > 1 ? setPaginationIndex(paginationIndex-1) : {}}/>
            </PaginationItem>

            {/*All the way back.*/}
            <PaginationItem>
                <PaginationLink className = "cursor-pointer hover:bg-slate-400" onClick={() => {setPaginationIndex(1); scrollToTop();}}> {"<<"}</PaginationLink>
            </PaginationItem>

            {/*Current page.*/}
            <PaginationItem>
                <PaginationLink className = "cursor-pointer bg-slate-500 hover:bg-slate-400" onClick={() => {setPaginationIndex(paginationIndex); scrollToTop()}}>{paginationIndex}</PaginationLink>
            </PaginationItem>

            {/*If pagination is past a certain point, don't show this option. One page forward*/}
            {paginationIndex + 1> maxPagination ? <div></div> :<PaginationItem>
                <PaginationLink className = "cursor-pointer hover:bg-slate-400" onClick={() => {setPaginationIndex(paginationIndex+1); scrollToTop()}}>{paginationIndex + 1}</PaginationLink>
            </PaginationItem>}
            
            {/*If pagination is past a certain point, don't show this option. Two pages forward*/}
            {paginationIndex + 2 > maxPagination ? <div></div> :<PaginationItem>
                <PaginationLink className = "cursor-pointer hover:bg-slate-400" onClick={() => {setPaginationIndex(paginationIndex+2); scrollToTop()}}>{paginationIndex + 2}</PaginationLink>
            </PaginationItem>}
            
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>

            {/*All the way forward. */}
            <PaginationItem>
                <PaginationLink className = "cursor-pointer hover:bg-slate-400" onClick={() => {setPaginationIndex(maxPagination); scrollToTop();}}> {">>"}</PaginationLink>
            </PaginationItem>

            {/*Foward one space*/}
            <PaginationItem>
                <PaginationNext className = "cursor-pointer hover:bg-slate-400" onClick={() => paginationIndex < maxPagination ? setPaginationIndex(paginationIndex+1) : {}}/>
            </PaginationItem>
        </PaginationContent>
    </Pagination>

        </>)
}