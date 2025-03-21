import { getSections } from "@/lib/sjsu";
import { writeFile } from "fs/promises";

(async() => {
    const season = process.argv[2] ?? "spring";
    if (season !== "spring" && season !== "summer" && season !== "fall" && season !== "winter") {
        console.error("Unknown season: " + season);
        return;
    }
    const year = process.argv[3] ? parseInt(process.argv[3]) : (new Date()).getFullYear();

    const sections = await getSections(season, year);
    await writeFile(`sections-${season}-${year}.json`, JSON.stringify(sections, undefined, "\t"), "utf-8");
})();