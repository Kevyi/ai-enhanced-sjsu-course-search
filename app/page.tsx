import { Suspense } from "react";
import { CoursesTable, FallbackTable } from "@/components/CoursesTable";
import { getCachedSections } from "@/lib/sjsu/cached";

export default async function Home() {
  const sectionsPromise = getCachedSections("spring", 2025);
  return (
    <div className="px-20 py-10">
      <Suspense fallback={<FallbackTable />}>
        <CoursesTable sectionsPromise={sectionsPromise} />
      </Suspense>
    </div>
  );
}
