"use client";

import { TeacherRatings } from "@/lib/rmp/queries";
import useSWR from "swr";
import { FaStar } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CourseReviews({ rmpId }: { rmpId: string }) {
    
    

    const { data, error, isLoading } = useSWR<TeacherRatings>(`/api/rmp/${rmpId}/reviews`, fetcher);
    return isLoading ? <div>Loading...</div> : error ? <div>An error occurred.</div> : <div className="flex flex-col gap-2">
        {data?.node.ratings.edges.map(e => {
            const reviewColor = `${e.node.clarityRating > 3.5 ? 'bg-green-500' : e.node.clarityRating > 2.5 ? 'bg-amber-500': 'bg-red-600'}`;
            return <div key={e.cursor} className= {`rounded-md p-5 text-black ${reviewColor}`}>
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <span className="font-bold text-xl">{e.node.class}</span>
                        <span>{e.node.clarityRating}/5</span>
                        <FaStar className = "text-yellow-500"></FaStar>
                    </div>
                    
                    <div>
                        {new Date(e.node.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                </div>
                <hr className="my-1 border-t border-slate-600" />
                <div className = "">
                    {e.node.comment}
                </div>

            </div>;
        })}
    </div>;
}