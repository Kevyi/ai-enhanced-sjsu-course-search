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
import CourseCard from "@/components/CourseCard";
import CourseModal from "@/components/CourseModal";
import { useState } from "react";
import { Section } from "@/lib/sjsu/section";
import { RMPInfo, RMPProfessorInfo } from "@/lib/rmp/type";

const TempDisplay = ({section, rmpInfo} : {section: Section, rmpInfo: RMPProfessorInfo | null}) => {
  return (
      <div className = "flex justify-center">
        <TiltCard section = {section} />
        {rmpInfo?.rmp?.avgDifficulty}
      </div>
    
  );
};

const ROTATION_RANGE = 10.5;
const HALF_ROTATION_RANGE = 10.5 / 2;

const TiltCard = ({section}: {section: Section}) => {
  
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


  const available: boolean = true;
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
      className="relative h-96 w-72 rounded-xl bg-slate-900"
    >
      <div
        onClick={() => setIsOpen(true)}
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-3 grid rounded-xl bg-slate-900 shadow-lg"
      >
        {/*w-xs doesn't work, must have [px] for some reason/*/}
        <Card className = "bg-slate-800 transition delay-450 hover:bg-slate-700 hover:cursor-pointer">
            <CardHeader>
                {/* Title should be cut off after some time if too long. */}
                <CardTitle className = "font-extrabold text-blue-400 text-xl">{section.course_title}</CardTitle>
                <CardDescription> 
                    {/* Map out one star for each score */}
                    <h1 className="text-white m-1">
                        {section.instructor}
                    </h1>
                    <div className = "text-yellow-500">
                        <div className = "flex m-1">
                            <FaStar /> <FaStar />
                        </div>
                        <span className = "m-1">RMP Score</span>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <p className = "text-gray-400">This class is whatever, I don't recommend to take this class....</p>
            </CardContent>

            <CardContent>
                <p className = "text-white">some thing here?</p>
            </CardContent>

            <CardFooter>
               {/* Tag will be illustrated depending if class is available or not. */}
               {available ? 
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
    <CourseModal isOpen={isOpen} setIsOpen={setIsOpen}></CourseModal>
    </> 
  );
};

export default TempDisplay;