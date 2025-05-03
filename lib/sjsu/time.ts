"use client";

import { SchoolDays, Section } from "./types";

export function parseSectionDayTimes(section: Section) {
    const dayTimes: Partial<Record<SchoolDays, ({from: number, to: number})[]>> = {};

    const timeChunks = section.times.split(" ").filter(t => t !== "");
    if (timeChunks.length === 1) {
        if (section.days === "TBA" || section.times === "TBA") return dayTimes;

        const days = parseDaysString(section.days);
        const times = [parseTimeString(section.times)];
        days.forEach(d => dayTimes[d] = times);
        return dayTimes;
    }

    for (let i = 0; i < timeChunks.length; i += 2) {
        if (timeChunks[i] === "TBA" || timeChunks[i + 1] === "TBA") continue;

        const days = parseDaysString(timeChunks[i]);
        const time = parseTimeString(timeChunks[i + 1]);
        days.forEach(d => {
            if (!dayTimes[d]) dayTimes[d] = [];
            dayTimes[d].push(time);
        });
    }

    return dayTimes;
}

function parseTimeString(str: string): {from: number, to: number} {
    const [from, to] = str.split("-")
    return {from: timeStringToMinutes(from), to: timeStringToMinutes(to)};
}

function timeStringToMinutes(str: string) {
    const amPm = str.slice(-2);
    const [hourString, minString] = str.slice(0, -2).split(":");
    
    const hour = (parseInt(hourString) % 12) + (amPm === "PM" ? 12 : 0);
    return hour * 60 + parseInt(minString);
}

const dayStringMapping: {[str: string]: SchoolDays} = {
    "M": "Mon",
    "T": "Tue",
    "W": "Wed",
    "R": "Thu",
    "F": "Fri",
    "S": "Sat"
}

export function parseDaysString(str: string) {
    const days: Set<SchoolDays> = new Set();
    for (const d of str) {
        if (dayStringMapping[d]) days.add(dayStringMapping[d]);
    }
    return days;
}