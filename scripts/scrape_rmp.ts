import "dotenv/config";
import { writeFileSync } from "fs";
import { searchTeacher } from "../lib/rmp";
import { getSections } from "../lib/sjsu";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { AnyBulkWriteOperation, MongoClient } from "mongodb";
import { SectionWithRMP } from "@/lib/sjsu/types";

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
  const professors = new Map<string, string>();
  sections.forEach((s) => {
    if (!s.instructor_email) return;
    professors.set(s.instructor_email, s.instructor.split("/")[0].trim());
  });

  const remainingProfessors = [...professors];
  const data: {
    [email: string]: {
      name: string;
      rmp: SectionWithRMP["rmp"]
    };
  } = {};

  let found = 0;
  await Promise.all(
    Array(5)
      .fill(undefined)
      .map(async () => {
        while (remainingProfessors.length !== 0) {
          const [professorEmail, professorName] = remainingProfessors.pop()!;
          const rmpInfo = await searchTeacher(professorName);
          data[professorEmail] = {
            name: professorName,
            rmp: rmpInfo
              ? {
                  avgDifficulty: rmpInfo.avgDifficulty,
                  avgRating: rmpInfo.avgRating,
                  id: rmpInfo.id,
                  legacyId: rmpInfo.legacyId,
                  numRatings: rmpInfo.numRatings,
                  wouldTakeAgainPercent: rmpInfo.wouldTakeAgainPercent,
                }
              : null,
          };

          if (rmpInfo) found++;
          console.log(
            professorName +
              " " +
              (professors.size - remainingProfessors.length) +
              "/" +
              professors.size +
              (rmpInfo ? "" : " (NOT FOUND!)")
          );
        }
      })
  );
  console.log("Found " + found + "/" + professors.size);

  if (mode === "json") {
    writeFileSync("rmp.json", JSON.stringify(data, undefined, "\t"), "utf8");
  } else {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db("cmpe151");
    const collection = db.collection("rmp_professors");

    const updateOperations: AnyBulkWriteOperation[] = Object.entries(data).map(
      ([professorEmail, professor]) => {
        return {
          updateOne: {
            filter: {
              email: professorEmail,
            },
            update: {
              $set: { email: professorEmail, ...professor },
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
