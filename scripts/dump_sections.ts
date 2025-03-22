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

    const db = client.db("course_sections");
    const collection = db.collection(season + "-" + year);

    const updateOperations: AnyBulkWriteOperation[] = sections.map(
      (section) => {
        return {
          updateOne: {
            filter: {
              section: section.section,
            },
            update: {
              $set: section,
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
