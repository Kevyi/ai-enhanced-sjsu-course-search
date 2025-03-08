"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


export default function CourseModule(){


    return <>
        {/*w-xs doesn't work, must have [px] for some reason/*/}

        <Card className = "bg-slate-700">
            <CardHeader>
                {/* Title should be cut off after some time if too long. */}
                <CardTitle className = "font-extrabold">Title of Class</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>

    
    
    </>

}