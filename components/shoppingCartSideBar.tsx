import { useState, useEffect } from "react";
import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CourseTiltCard from "@/components/courseComponents/CourseTiltCard"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SectionWithRMP } from "@/lib/sjsu/types";
import localStorageCourseWatcher from "@/components/localStorageCourseWatcher"

export default function ShoppingCartSideBar({courses} : {courses : SectionWithRMP[]}) {

    // const [coursesInShoppingCart, setCoursesInShoppingCart] = useState<(React.ReactNode | undefined)[]>([]);

    //Custom react hook.
    const courseIDsInCart = localStorageCourseWatcher("courses");

    //Remove from cart.
    function removeFromCart (courseID : string) {
        //Gets an array of strings (where each string is a courseID)
        const myArray = JSON.parse(localStorage.getItem("courses")!);
        const newArray= myArray.filter((item: string) => item !== courseID);
        localStorage.setItem("courses", JSON.stringify(newArray));
    }

    // useEffect(()=>{

        
    //     {/* Only shows the courses that are inside locastorage courses. */}
    //     const coursesInShoppingCart = courses.map((item) => {if(!courseIDsInCart.includes(item.class_number)) return;
    //         return (<>
    //        <div key = {item.class_number + "shoppingCartCourseDIV"} className = "p-0 flex-col h-screen">
    //            <CourseTiltCard key={item.class_number + "shoppingCartCourseCARD"} section = {item} inShoppingCart = {true}></CourseTiltCard>

    //            <Button key={item.class_number + "shoppingCartCourseBUTTON"}  onClick = {() => removeFromCart(item.class_number)} variant = "outline" className = "ml-6 mt-3 bg-red-600 text-black border-white hover:bg-red-500"> Remove</Button>
               
    //        </div>
    //        </>
    //    )});

    //    setCoursesInShoppingCart(coursesInShoppingCart);



    // },[courseIDsInCart]);
    


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className = "bg-slate-700 hover:bg-slate-600 border-none">Cart. Put icon here.</Button>
      </SheetTrigger>
      <SheetContent className = "bg-slate-900 border-gray-800 h-screen">
        <SheetHeader>
          <SheetTitle className = "text-white text-2xl">Courses</SheetTitle>
          <SheetDescription>
            These are the courses that you have added to your shopping cart so far.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-col gap-4 py-4 text-white overflow-auto max-h-screen [scrollbar-width:none]">

            {/* Only shows the courses that are inside locastorage courses. */}
            {courseIDsInCart.length === 0 ? <div className = "text-center">You haven't put any courses inside yet!</div> : 
            
                courses.map((item) => { if(courseIDsInCart.includes(item.class_number))
                    return (
                <div key={item.class_number + "shoppingCartCourseDIV"} className="p-0 flex-col mb-5">
                    <CourseTiltCard key={item.class_number + "shoppingCartCourseCARD"} section={item} inShoppingCart = {true}/>
                    <Button 
                        key={item.class_number + "shoppingCartCourseBUTTON"} 
                        onClick={() => removeFromCart(item.class_number)} 
                        variant="outline" 
                        className="ml-6 mt-3 bg-red-600 text-black border-white hover:bg-red-500"
                        >
                        Remove
                    </Button>
                </div>
            )})}
            {/*Fixes some jank spacing crap. */}
            <div className = "h-20"></div>

        </div>
        
        <SheetFooter className = "mt-5">
          <SheetClose asChild>

          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
