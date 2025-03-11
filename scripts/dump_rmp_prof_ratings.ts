import { getTeacherRatings, searchTeacher } from "@/lib/rmp";
import { writeFile } from "fs/promises";

(async() => {
    const rmpInfo = await searchTeacher(process.argv.slice(2).join(" "));
    if (!rmpInfo) {
        console.error("Teacher not found");
        return;
    }
    const ratings = await getTeacherRatings(rmpInfo.id);
    await writeFile(`ratings-${ratings.node.firstName.toLowerCase()}-${ratings.node.lastName.toLowerCase()}.json`, JSON.stringify(ratings, undefined, "\t"), "utf-8");
})();