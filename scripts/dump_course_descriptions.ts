import "dotenv/config";
import { AnyBulkWriteOperation, MongoClient } from "mongodb";
import { HTMLAnchorElement, Window } from "happy-dom";

const CATALOG_URL = "https://catalog.sjsu.edu";

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();

  const db = client.db("cmpe151");
  const collection = db.collection("course_descriptions");

  const html = await (await fetch(CATALOG_URL)).text();
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = html;

  const courseDescriptionsURL =
    CATALOG_URL +
    (
      [...document.querySelectorAll("a.navbar")].filter(
        (a) => a.textContent === "Course Descriptions"
      )[0] as HTMLAnchorElement
    ).href;

  // TODO: Don't hardcode the last page
  for (let i = 1; i <= 54; i++) {
    const pageHTML = await (
      await fetch(courseDescriptionsURL + "&filter[cpage]=" + i)
    ).text();
    const pageWindow = new Window();
    const pageDocument = pageWindow.document;
    pageDocument.body.innerHTML = pageHTML;

    const courseURLs = [
      ...pageDocument.querySelectorAll(".block_content td > a"),
    ]
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((c) => c.startsWith("preview"));
    pageWindow.close();

    const descriptions: { course: string; description: string }[] = [];

    await Promise.all(
      Array(5)
        .fill(undefined)
        .map(async () => {
          while (courseURLs.length > 0) {
            const courseURL = courseURLs.pop();
            const courseWindow = new Window();
            const courseDocument = courseWindow.document;
            try {
              const courseHTML = await (
                await fetch(CATALOG_URL + "/" + courseURL)
              ).text();
              courseDocument.body.innerHTML = courseHTML;

              let description = "";
              for (let node = courseDocument.querySelector(
                ".block_content p br"
              )!.nextSibling!; node.textContent?.length; node = node.nextSibling) {
                description += node.textContent;
              }
              const title = courseDocument.querySelector(
                "#course_preview_title"
              )!.textContent!;
              descriptions.push({
                course: title.split("-").slice(1).join("-").trim(),
                description: description.trim(),
              });
              console.log(description.trim());
              console.log(courseURLs.length, i);
            } catch (e) {
              console.log(e);
            }

            courseWindow.close();
          }
        })
    );

    const updateOperations: AnyBulkWriteOperation[] = descriptions.map(
      (description) => {
        return {
          updateOne: {
            filter: {
              course: description.course,
            },
            update: {
              $set: { ...description },
            },
            upsert: true,
          },
        };
      }
    );
    await collection.bulkWrite(updateOperations);
  }

  window.close();
  client.close();
})();
