// "use client";
import Navbar from "@/components/Navbar"
import Home from "@/components/homePage"
import { getCachedAvailableSemesters, getCachedSections } from "@/lib/sjsu/cached";

export default async function HomePage(){
    const sections = (await getCachedSections("spring", 2025));
    return(
    <>
     
    <Home courses = {sections}></Home>

   </>
)}