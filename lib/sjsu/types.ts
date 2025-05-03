export type Season = "spring" | "summer" | "fall" | "winter";

export type Section = {
  section: string;
  section_url?: string;
  class_number: string;
  instruction_mode: string;
  course_title: string;
  satisfies: string;
  units: string;
  type: string;
  days: string;
  times: string;
  instructor: string;
  instructor_email?: string;
  location: string;
  dates: string;
  open_seats: string;
  notes: string;
};

export type SectionWithRMP = Section & {
  rmp: {
    avgDifficulty: number;
    avgRating: number;
    id: string;
    legacyId: number;
    numRatings: number;
    wouldTakeAgainPercent: number;
  } | null;
  description: string;
};

export type SchoolDays = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";