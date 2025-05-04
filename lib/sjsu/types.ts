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

export interface RMPInfo {
  avgDifficulty: number;
  avgRating: number;
  id: string;
  numRatings: number;
  wouldTakeAgainPercent: number;
  legacyId: string;
}

export interface SectionWithRMP {
  section: string;
  class_number: string;
  instruction_mode: string;
  course_title: string;
  satisfies: string;
  units: string;
  type: string;
  days: string;
  times: string;
  instructor: string;
  instructor_email: string;
  location: string;
  dates: string;
  open_seats: string;
  notes: string;
  section_url?: string;
  rmp?: RMPInfo;
  description?: string;
}

export type SchoolDays = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";