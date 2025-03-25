import "dotenv/config";
import { getSections } from "@/lib/sjsu";
import { writeFile } from "fs/promises";
import { AnyBulkWriteOperation, MongoClient } from "mongodb";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

(async () => {
  const { season, year, mode } = await yargs(hideBin(process.argv))
    .options({
      season: {
        choices: ["spring", "summer", "fall", "winter"] as const,
        default: "spring" as const,
      },
      year: {
        type: "number",
        default: new Date().getFullYear(),
      },
      mode: {
        choices: ["json", "mongodb"] as const,
        default: "json" as const,
      },
    })
    .parse();

  const sections = await getSections(season, year);
  if (mode === "json") {
    await writeFile(
      `sections-${season}-${year}.json`,
      JSON.stringify(sections, undefined, "\t"),
      "utf-8"
    );
  } else {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db("cmpe151");
    const collection = db.collection("course_sections");

    const updateOperations: AnyBulkWriteOperation[] = sections.map(
      (section) => {
        return {
          updateOne: {
            filter: {
              class_number: section.class_number,
              season,
              year
            },
            update: {
              $set: {...section, season, year},
            },
            upsert: true,
          },
        };
      }
    );
    await collection.bulkWrite(updateOperations);

    client.close();
  }
})();
