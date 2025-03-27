"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FaStar } from "react-icons/fa";




export default function CourseCard(){

    const available: boolean = true;
    

    return <>
        {/*w-xs doesn't work, must have [px] for some reason/*/}

        <Card className = "bg-slate-800 transition delay-450 hover:bg-slate-700 hover:cursor-pointer">
            <CardHeader>
                {/* Title should be cut off after some time if too long. */}
                <CardTitle className = "font-extrabold text-blue-400 text-xl">Title of Class</CardTitle>
                <CardDescription> 
                    {/* Map out one star for each score */}
                    <h1 className="text-white m-1">Teacher</h1>
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
   
    </>

}

