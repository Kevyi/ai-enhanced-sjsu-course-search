import fs from "fs";
import path from "path";

export function searchCourses(query: string, season: string, year: number) {
    const filePath = path.join(__dirname, `../data/sjsu_courses_${season}_${year}.json`);

    if (!fs.existsSync(filePath)) {
        return { error: `No course data found for ${season} ${year}.` };
    }

    const courses = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // 🔹 Perform a basic text search (on course title & instructor)
    const results = courses.filter(course =>
        course.course_title.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor.toLowerCase().includes(query.toLowerCase())
    );

    return results.length ? results : { error: "No matching courses found." };
}

