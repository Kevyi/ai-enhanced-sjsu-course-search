import { getSections } from "@/lib/sjsu/scraper";
import { writeFile } from "fs/promises";

(async() => {
    const sections = await getSections("spring", 2025);
    await writeFile("sections.json", JSON.stringify(sections, undefined, "\t"), "utf-8");
})();