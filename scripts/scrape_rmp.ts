import { writeFileSync } from "fs";
import { searchTeacher } from "../lib/rmp";
import { getSections } from "../lib/sjsu";

(async() => {
    const sections = await getSections("spring", 2025);
    const professors = new Map<string, string>();
    sections.forEach(s => {
        if( !s.instructor_email) return;
        professors.set(s.instructor_email, s.instructor.split("/")[0].trim());
    });

    const remainingProfessors = [...professors];
    const data: {[email: string]: {
        name: string,
        rmp: {
            avgDifficulty: number,
            avgRating: number,
            id: string,
            numRatings: number,
            wouldTakeAgainPercent: number
        } | null
    }} = {};
    let found = 0;
    await Promise.all(Array(5).fill(undefined).map(async () => {
        while (remainingProfessors.length !== 0){
            const [professorEmail, professorName] = remainingProfessors.pop()!;
            const rmpInfo = await searchTeacher(professorName);
            data[professorEmail] = {
                name: professorName,
                rmp: rmpInfo ? {
                    avgDifficulty: rmpInfo.avgDifficulty,
                    avgRating: rmpInfo.avgRating,
                    id: rmpInfo.id,
                    numRatings: rmpInfo.numRatings,
                    wouldTakeAgainPercent: rmpInfo.wouldTakeAgainPercent
                } : null
            }

            if (rmpInfo) found++;
            console.log(professorName + " " + (professors.size - remainingProfessors.length) + "/" + professors.size + (rmpInfo ? "" : " (NOT FOUND!)"));
            writeFileSync("rmp.json", JSON.stringify(data, undefined, "\t"), "utf8");
        }
    }));

    console.log("Found " + found + "/" + professors.size);
})();