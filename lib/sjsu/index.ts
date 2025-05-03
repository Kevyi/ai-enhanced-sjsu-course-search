"use server";

import {HTMLAnchorElement, HTMLTableCellElement, Window} from "happy-dom";
import {SchoolDays, Season, Section} from "@/lib/sjsu/types";

type TableHeadingProcessor = {name: keyof Section} | {process: (section: Partial<Section>, td: HTMLTableCellElement) => void};

const ALL_SCHEDULES_URL = "https://www.sjsu.edu/classes/schedules/index.php";
const SCHEDULE_URL =
    "https://www.sjsu.edu/classes/schedules/{season}-{year}.php";

const TABLE_HEADING_PROPS: {
    [heading: string]: TableHeadingProcessor
} = {
    Section: {
        process: (section, td) => {
            section.section = td.textContent!;
            // PSYC 196 courses do not have a section url
            section.section_url = (td.firstElementChild as HTMLAnchorElement)?.href;
        },
    },
    "Class Number": { name: "class_number" },
    "Mode of Instruction": { name: "instruction_mode" },
    "Course Title": { name: "course_title" },
    Satisfies: { name: "satisfies" },
    Units: { name: "units" },
    Type: { name: "type" },
    Days: { name: "days" },
    Times: { name: "times" },
    Instructor: {
        process: (section, td) => {
            section.instructor = td.textContent!;
            section.instructor_email = (td.firstElementChild as HTMLAnchorElement)?.href.replace("mailto:", "");
        },
    },
    Location: { name: "location" },
    Dates: { name: "dates" },
    "Open Seats": { name: "open_seats" },
    Notes: { name: "notes" },
};

export async function getSections(season: Season, year: number) {
    const html = await (await fetch(SCHEDULE_URL.replaceAll("{season}", season).replaceAll("{year}", year.toString()))).text();
    const window  = new Window();
    const document = window.document;
    document.body.innerHTML = html;

    const scheduleTable = document.querySelector("#classSchedule")!;
    const tableColumnProcessors: TableHeadingProcessor[] = [];
    for (let th = scheduleTable.querySelector("thead tr th"); th != null; th = th.nextElementSibling) {
        tableColumnProcessors.push(TABLE_HEADING_PROPS[th.textContent!]);
    }

    const sections: Section[] = [];
    for (let tr = scheduleTable.querySelector("tbody tr"); tr != null; tr = tr.nextElementSibling) {
        const section: Partial<Section> = {};
        let i = 0;
        for (let td = tr.firstElementChild as HTMLTableCellElement; td != null; td = td.nextElementSibling as HTMLTableCellElement) {
            const column = tableColumnProcessors[i];
            i++;

            if ("name" in column) {
                section[column.name] = td.textContent!.trim();
            } else if ("process" in column) {
                column.process(section, td);
            }
        }

        sections.push(section as Section);
    }

    window.close();
    return sections;
}

export async function getAvailableSemesters() {
    const html = await (await fetch(ALL_SCHEDULES_URL)).text();
    const window  = new Window();
    const document = window.document;
    document.body.innerHTML = html;

    const links = document.querySelector("#sjsu-maincontent")!.querySelectorAll("ul li a");
    const availableSemesters: [Season, number][] = [];

    for (const link of links) {
        const url = (link as HTMLAnchorElement).href;
        const segments = url.split("/");

        const lastSegment = segments[segments.length - 1];
        if (!lastSegment.endsWith(".php")) continue;

        const [season, year] = lastSegment.replace(".php", "").split("-");
        if (season !== "spring" && season !== "summer" && season !== "fall" && season !== "winter") continue;

        availableSemesters.push([season, parseInt(year)]);
    }

    window.close();
    return availableSemesters;
}