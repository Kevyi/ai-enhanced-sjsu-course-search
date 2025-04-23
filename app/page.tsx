import { Suspense } from "react";
import { CoursesTable, FallbackTable } from "@/components/CoursesTable";
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";

export default async function Home() {
  const sectionsPromise = getCachedAvailableSemesters().then(semesters => getCachedSections(semesters[semesters.length - 1][0], semesters[semesters.length - 1][1]));
  return (
    <div className="px-20 py-10">
      <Suspense fallback={<FallbackTable />}>
        <CoursesTable sectionsPromise={sectionsPromise} />
      </Suspense>
    </div>
  );
}
