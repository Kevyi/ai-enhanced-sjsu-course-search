"use server";

import { unstable_cache } from "next/cache";
import client from "../mongodb";
import { Season, SectionWithRMP } from "./types";
import { getAvailableSemesters } from ".";

const PART_LENGTH = 2000;

const getSectionsPart = unstable_cache(
  async (
    season: Season,
    year: number,
    part: number
  ) => {
    await client.connect();

    const db = client.db("cmpe151");
    const collection = db.collection("course_sections");
    const cursor = await collection.aggregate([
      { $match: { season, year } },
      { $skip: part * PART_LENGTH },
      { $limit: PART_LENGTH },
      {
        $project: {
          _id: 0,
          season: 0,
          year: 0,
        },
      },
      {
        $lookup: {
          from: "rmp_professors",
          localField: "instructor_email",
          foreignField: "email",
          as: "rmp",
        },
      },
      {
        $set: {
          rmp: {
            $arrayElemAt: ["$rmp.rmp", 0],
          },
        },
      },
      {
        $lookup: {
          from: "course_descriptions",
          localField: "course_title",
          foreignField: "course",
          as: "description",
        },
      },
      {
        $set: {
          description: {
            $arrayElemAt: ["$description.description", 0],
          },
        },
      },
    ]);
    return (await cursor.toArray()) as unknown as SectionWithRMP[];
  },
  [],
  { revalidate: 1800 }
);

const getSectionsSize = unstable_cache(
  async (
    season: Season,
    year: number
  ): Promise<number> => {
    await client.connect();

    const db = client.db("cmpe151");
    const collection = db.collection("course_sections");

    return await collection.countDocuments({ season, year });
  },
  [],
  { revalidate: 1800 }
);

export async function getCachedSections(
  season: Season,
  year: number
) {
  const size = await getSectionsSize(season, year);
  const parts = await Promise.all(
    Array(Math.ceil(size / PART_LENGTH))
      .fill(undefined)
      .map((_, i) => {
        return getSectionsPart(season, year, i);
      })
  );
  return parts.flat();
}

export const getCachedAvailableSemesters = unstable_cache(
  async () => {
    return await getAvailableSemesters();
  },
  [],
  { revalidate: 1800 }
)