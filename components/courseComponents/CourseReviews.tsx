"use client";

import { TeacherRatings } from "@/lib/rmp/queries";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CourseReviews({ rmpId }: { rmpId: string }) {
    const { data, error, isLoading } = useSWR<TeacherRatings>(`/api/rmp/${rmpId}/reviews`, fetcher);
    return isLoading ? <div>Loading...</div> : error ? <div>An error occurred.</div> : <div className="flex flex-col gap-2">
        {data?.node.ratings.edges.map(e => {
            return <div key={e.cursor} className="rounded-md p-2 bg-gray-200 text-black">
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <span className="font-bold text-xl">{e.node.class}</span>
                        <span>{e.node.clarityRating}/5</span>
                    </div>
                    <div>
                        {new Date(e.node.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                </div>
                {e.node.comment}
            </div>;
        })}
    </div>;
}