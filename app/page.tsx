import {getSections} from "@/lib/sjsu/scraper";
import {Suspense} from "react";
import {CoursesTable, FallbackTable} from "@/components/CoursesTable";

export default async function Home() {
  const sectionsPromise = getSections("spring", 2025);
  return <div className="px-20 py-10">
      <Suspense fallback={<FallbackTable/>}>
        <CoursesTable sectionsPromise={sectionsPromise}/>
      </Suspense>
    </div>
}
