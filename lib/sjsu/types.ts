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
  term: string;
  year: number;
};

export interface SectionWithRMP extends Section {
  rmp_rating?: number;
  rmp_difficulty?: number;
  rmp_tags?: string[];
  rmp_reviews?: string[];
  rmp_url?: string;
}
