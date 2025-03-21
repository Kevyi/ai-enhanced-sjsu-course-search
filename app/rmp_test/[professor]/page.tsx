import { getTeacherRatings, searchTeacher } from "@/lib/rmp";

export default async function name({params}: {params: Promise<{professor: string}>}) {
    const {professor} = await params;
    const teacher = (await searchTeacher(decodeURIComponent(professor)));

    if (!teacher)
        return <>
            Could not find professor
        </>

    const teacherInfo = await getTeacherRatings(teacher.id);
    return <div className="p-2 space-y-2">
        <h1 className="text-lg font-bold">{teacherInfo.node.firstName} {teacherInfo.node.lastName}</h1>
        <h2 className="text-md font-semibold">{teacherInfo.node.avgRating}/5</h2>
        <p>{teacherInfo.node.numRatings} Reviews</p>
        <p>{teacherInfo.node.wouldTakeAgainPercent}% would take again | {teacherInfo.node.avgDifficulty} Level of Difficulty</p>
        {teacherInfo.node.ratings.edges.map((rating) => {
            return <div key={rating.cursor} className="border p-4 rounded-md">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <span className="font-bold">{rating.node.class}</span>
                        <span>{rating.node.clarityRating}/5</span>
                    </div>
                    <span className="font-bold">{rating.node.date}</span>
                </div>
                <p>{rating.node.comment}</p>
                <div className="flex gap-2">
                    {rating.node.ratingTags.split("--").map((tag, i) => {
                        if (tag.trim() === "") return null;
                        return <span key={i} className="bg-gray-100 rounded-md p-2">{tag}</span>
                    })}
                </div>
            </div>
        })}
    </div>
}