"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { SectionWithRMP } from "@/lib/sjsu/types";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"



const available : boolean = true;


function addItemToLocalStorageArray(courseID : string) {
  const myArray = (JSON.parse(localStorage.getItem("courses") || "[]")) as any[];
  const localStorageFunction = myArray.includes(courseID) ? console.log("make pop up that says course already inside cart") : myArray.push(courseID);;
  localStorage.setItem("courses", JSON.stringify(myArray));
}

function insideLocalStorage(courseID : string){
  const myArray = (JSON.parse(localStorage.getItem("courses") || "[]")) as any[];
  console.log(myArray.includes(courseID))
  return myArray.includes(courseID);
}

const SpringModal = ({
  section,
  isOpen,
  setIsOpen,
  inShoppingCart
}: {
  section: SectionWithRMP,
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  inShoppingCart : boolean;
}) => {
  const { toast } = useToast()
  return (
    // Animated modal
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          {/* motion.div is the actual modal itself. */}
          <motion.div
          // Originally 12.5deg
            //Initial start of degree change.
            initial={{ scale: 0, rotate: "0deg" }}

            //Animate to end of degree change.
            animate={{ scale: 1, rotate: "0deg" }}

            //Exit degree change.
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            //Background color for the modal
            className="bg-gradient-to-br from-slate-800 to-indigo-900 text-white p-6 rounded-lg w-full max-w-6xl shadow-xl cursor-default relative overflow-hidden"
          >
            {/* A little imprint on the plain slab */}
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />

            {/* Holds the entire inside of modal */}
            <div className="relative z-10">
              <div className="max-w-xs mb-2 rounded-full text-5xl text-yellow-500 flex justify-center mx-auto">

                {/* Returns amount of stars according to rating. */}
                <StarAmount sectionNumber = {section.class_number} rating = {section.rmp?.avgRating} inShoppingCart ={inShoppingCart}/>

              </div>
              <h2 className="text-5xl font-bold text-center mb-2">
                {section.course_title}- {section.section}
              </h2>

              <h3 className="text-3xl font-bold text-center mb-2">
                <span className = "bg-gradient-to-br from-yellow-600 to-blue-400 bg-clip-text text-transparent">
                  {section.instructor}
                </span>
              </h3>

              <p className="text-center mb-6">
                Course Description: random stuff about the courses. AI generated?
              </p>

              {/* Location will also specify if online. */}
              <h1 className = "text-2xl font-bold text-center text-amber-600">Location: {section.location}</h1>
              <div>
                
                <div className = "flex justify-center gap-10 m-3 text-xl">
                  <div className = "">
                    <p><b>Dates: </b>{section.dates}</p>
                    <p><b>Time: </b>{section.times}</p>
                    <p><b>Days: </b>{section.days}</p>
                  </div>

                  <div className = "">
                    <p><b>Credits: </b>{section.units}</p>
                    <p><b>Satisfies: </b>{section.satisfies}</p>
                    <p><b>Type: </b>{section.type}</p>
                  </div>
                </div>

                

              </div>

              <p className = "text-center font-bold">Contact Instructor Email: <a className = "font-semibold">{section.instructor_email}</a></p>
              <p className = "text-center font-bold">Course Code: <a className = "font-semibold">{section.class_number}</a></p>

              {parseInt(section.open_seats) != 0 ? 
               <div className = "hover:opacity-80 transition-opacity max-w-xs pl-2 pr-2 border rounded-lg bg-green-600 ml-auto mr-auto m-3 p-2 text-center">
                    <span className = "font-bold">AVAILABLE: {section.open_seats} {parseInt(section.open_seats) == 1 ? "Seat" : "Seats"}</span>
                </div>
               :
                <div className = "hover:opacity-80 transition-opacity max-w-xs pl-2 pr-2 border rounded-lg bg-red-800 ml-auto mr-auto m-3 p-2 text-center">
                    <span className = "font-bold">Full</span>
                </div> 
                }

              {/* Holds the buttons to go back and add to clipboard. */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full max-w-xs py-2 rounded ml-auto"
                >
                  Back
                </button>

                
                <Button
                  onClick={() => {
                    insideLocalStorage(section.class_number) ? 
                    toast({
                      className: "bg-red-600 border-none text-white",
                      title: <p className = "text-xl">Failure!</p>,
                      description: <p className = "text-sm">You already have the following course added! <a className = "font-bold">{section.section}</a></p>,
                      duration: 2000, // optional duration for auto-dismissal
                      variant: "default", // or 'error', 'info', etc.
                    })
                    :
                    toast({
                      className: "bg-green-600 border-none text-white",
                      title: <p className = "text-xl">Success!</p>,
                      description: <p className = "text-sm">Added the following course: <a className = "font-bold">{section.section}</a></p>,
                      duration: 2000, // optional duration for auto-dismissal
                      variant: "default", // or 'error', 'info', etc.
                    }); addItemToLocalStorageArray(section.class_number);
                  }}
                  className="bg-white hover:opacity-80 transition-opacity text-blue-600 font-semibold w-full max-w-xs py-2 rounded mr-auto"
                >
                  Add to shopping-cart.
                  Add a toast.
                </Button>
              </div>
            </div>
            
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function StarAmount({ sectionNumber, rating, inShoppingCart } : {sectionNumber : string, rating : number | undefined, inShoppingCart : boolean}) {
  const componentList = [];
  if (!rating) return <></>; // Return empty if rating is null
  const decimal : number = (rating % 1) * 100;
  for (let i = 0; i < Math.floor(rating); i++) {

    const key = inShoppingCart ? sectionNumber + "cardStar"+ i + "modalSHOPPINGCARTSTAR" : sectionNumber + "cardStar"+ i;
    componentList.push(<FaStar key = {key}/>);
  }
  //Try to include percentage star.
  // componentList.push();

  return (<>{componentList}</>
  );
}




export default SpringModal;