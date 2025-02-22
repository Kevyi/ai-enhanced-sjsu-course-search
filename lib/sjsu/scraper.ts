"use server";

import { JSDOM } from "jsdom";
import {Section} from "@/lib/sjsu/section";

const SCHEDULE_URL =
    "https://www.sjsu.edu/classes/schedules/{season}-{year}.php";

const TABLE_HEADING_PROPS: {
    [heading: string]: {name: keyof Section} | {process: (section: Partial<Section>, td: HTMLTableCellElement) => void}
} = {
    Section: {
        process: (section, td) => {
            section.section = td.textContent!;
            // PSYC 196 courses do not have a section url
            section.section_url = td.querySelector("a")?.href;
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
            section.instructor_email = td.querySelector("a")?.href.replace("mailto:", "");
        },
    },
    Location: { name: "location" },
    Dates: { name: "dates" },
    "Open Seats": { name: "open_seats" },
    Notes: { name: "notes" },
};

export async function getSections(season: "spring" | "summer" | "fall" | "winter", year: number) {
    const {
        window: { document },
    } = await JSDOM.fromURL(
        SCHEDULE_URL.replaceAll("{season}", season).replaceAll("{year}", year.toString())
    );
    const scheduleTable = document.querySelector("#classSchedule")!;
    const tableColumnProcessors = [
        ...scheduleTable.querySelectorAll("thead tr th"),
    ].map((th) => {
        return TABLE_HEADING_PROPS[th.textContent!];
    });

    return [...scheduleTable.querySelectorAll("tbody tr")].map((tr) => {
        const section: Partial<Section> = {};
        [...tr.querySelectorAll("td")].forEach((td, i) => {
            const column = tableColumnProcessors[i];
            if (!column) return;

            if ("name" in column) {
                section[column.name] = td.textContent!.trim();
            } else if ("process" in column) {
                column.process(section, td);
            }
        });
        return section as Section;
    });
}