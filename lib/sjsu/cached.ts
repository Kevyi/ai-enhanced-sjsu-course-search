"use server";

import { unstable_cache } from "next/cache";
import client from "../mongodb";
import { Section } from "./types";

const PART_LENGTH = 2000;

const getSectionsPart = unstable_cache(
  async (
    season: "spring" | "summer" | "fall" | "winter",
    year: number,
    part: number
  ) => {
    await client.connect();

    const db = client.db("course_sections");
    const collection = db.collection(season + "-" + year);
    const cursor = (await collection.find({}, { projection: { _id: 0 } }))
      .skip(part * PART_LENGTH)
      .limit(PART_LENGTH);

    return (await cursor.toArray()) as unknown as Section[];
  },
  [],
  { revalidate: 1800 }
);

const getSectionsSize = unstable_cache(
  async (
    season: "spring" | "summer" | "fall" | "winter",
    year: number
  ): Promise<number> => {
    await client.connect();

    const db = client.db("course_sections");
    const collection = db.collection(season + "-" + year);

    return await collection.countDocuments();
  },
  [],
  { revalidate: 1800 }
);

export async function getCachedSections(
  season: "spring" | "summer" | "fall" | "winter",
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
