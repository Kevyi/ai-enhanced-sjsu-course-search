"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { FaStar } from "react-icons/fa";
import CourseModal from "@/components/courseComponents/CourseModal";
import { useState } from "react";
import { SectionWithRMP } from "@/lib/sjsu/types";


const TiltCardDisplay = ({section, inShoppingCart = false} : {section: SectionWithRMP, inShoppingCart : boolean}) => {
  return (
      <div className = "flex justify-center m-0">
        <TiltCard section = {section} inShoppingCart = {inShoppingCart} />
      </div>
    
  );
};

const ROTATION_RANGE = 10.5;
const HALF_ROTATION_RANGE = 10.5 / 2;

const TiltCard = ({section, inShoppingCart}: {section: SectionWithRMP, inShoppingCart : boolean}) => {
  
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };


 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-96 w-72 rounded-xl bg-gray-800 m-1"
    >
      <div
        onClick={() => setIsOpen(true)}
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-3 grid rounded-xl bg-gray-800 shadow-lg"
      >
        {/*w-xs doesn't work, must have [px] for some reason/*/}
        <Card className = "bg-gray-zinc transition delay-450 hover:bg-slate-600 hover:cursor-pointer max-w-[265]">
            <CardHeader className = "pb-2">
                {/* Title should be cut off after some time if too long. */}
                <CardTitle className = "font-extrabold text-blue-400 text-xl">
                  <div className = "max-h-20 max-w-50 overflow-y-hidden ">{section.course_title}</div>
                </CardTitle>
                <CardDescription> 
                    {/* Map out one star for each score */}
                    <h1 className="text-white m-1 font-bold">
                        {section.instructor}
                    </h1>
                    <div className = "text-yellow-500">
                        <div className = "flex m-1">
                          <StarAmount sectionNumber = {section.class_number} rating = {section.rmp?.avgRating} inShoppingCart = {inShoppingCart}/>
                        </div>
                        {/* If undefined, display none instead. */}

                          <span className = "m-1 font-bold">RMP Score: {section.rmp?.avgRating} </span>
                    </div>
                    
                    
                </CardDescription>
            </CardHeader>

            <CardContent className = "pb-2">
                <p className = "text-gray-400 overflow-y-auto max-h-16 [scrollbar-width:none]">
                  This class is whatever, I don't recommend to take this class....
                  This class is whatever, I don't recommend to take this class....
                  This class is whatever, I don't recommend to take this class....
                </p>
            </CardContent>

            <CardContent>
                <p className = "text-white">some thing here?</p>
            </CardContent>

            <CardFooter>
               {/* Tag will be illustrated depending if class is available or not. */}
               {parseInt(section.open_seats) != 0 ? 
               <div className = "w-lg pl-2 pr-2 border rounded-lg bg-green-600">
                    AVAILABLE
                </div>
               :
                <div className = "w-lg pl-2 pr-2 border rounded-lg bg-red-800">
                    FULL
                </div> 
                }
            </CardFooter>
            {/* Maybe have tags down here or something. Like easy! Hard! etc */}
        </Card>

      </div>
    </motion.div>

    {/* API call for data in Modal or pass information from card? */}
    <CourseModal section = {section} isOpen={isOpen} setIsOpen={setIsOpen} inShoppingCart = {inShoppingCart}></CourseModal>
    
    </> 
  );
};

function StarAmount({ sectionNumber, rating, inShoppingCart } : {sectionNumber : string, rating : number | undefined, inShoppingCart : boolean}) {
  const componentList = [];
  if (!rating) return <></>; // Return empty if rating is null
  const decimal : number = (rating % 1) * 100;
  for (let i = 0; i < Math.floor(rating); i++) {

    const key = inShoppingCart ? sectionNumber + "cardStar"+ i + "SHOPPINGCARTSTAR" : sectionNumber + "cardStar"+ i;
    componentList.push(<FaStar key = {key}/>);
  }
  //Try to include percentage star.
  // componentList.push();

  return (<>{componentList}</>
  );
}

export default TiltCardDisplay;