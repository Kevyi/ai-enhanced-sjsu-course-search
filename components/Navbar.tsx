"use client";

import Image from 'next/image';
import tempImage from "@/app/sjsu image.png"
import { useEffect, useState } from "react";
import ShoppingCartSideBar from "@/components/shoppingCartSideBar"
import { SectionWithRMP } from "@/lib/sjsu/types";
import Link from 'next/link';

export default function Navbar({ scroll = false, courses } : {scroll : boolean, courses : SectionWithRMP[]}){

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!scroll) {
      setIsVisible(true);
      return;
    }

    const target = document.getElementById("nextSection");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [scroll]);

  const visibilityAnimation = `transition-transform duration-500 ease-in-out ${
    isVisible ? "translate-y-0" : "-translate-y-full"
  }`;




//const navBarAnimation = `transition-all duration-300 ease-in-out ${isShrunk ? "py-2" : "py-6"}`;
const buttonStyling = "bg-green-500 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8 px-0";

   return <>
      <div className = {`py-4 sticky top-0 z-50 bg-slate-900 font-mono border-b border-b-blue-500/50 ${visibilityAnimation}`}>
        <div className = "transition-all duration-700 ease-in-out">
            {/*${isShrunk ? "p-3" : "p-2"} */}
            {/*Component wrapper in navbar.*/}
            {/* Removed container TailwindCSS. */}
            <div className = "p-5 flex h-14 items-center ">

                {/*This is where the Logo and webpage name goes.*/}
                <div className = "mr-4 hidden md:flex">
                  <Link href = "/home" className = "mr-4 flex items-center gap-2 lg:mr-6">
                    {/*Click logo or name to go to home.*/}
                    <Image src={tempImage} className = "mr-5"alt="Temp" width={30} height={30} />
    
                    <span className = "hidden font-bold lg:inline-block text-2xl text-white"> SJSU Searchify</span>

                  </Link>
                  
                  {/*Lists a bunch of navigation*/}
                  <nav className = "flex items-center gap-4 text-sm xl:gap-6">
                    <Link className = "transition-colors hover:text-foreground/80 text-foreground/80" href = "/courseTest">
                        <span className = "font-semibold text-yellow-500">
                          Course Search
                        </span>
                    </Link>
                  </nav>
                </div>

                {/* Right side button, links to somewhere */}
                <div className = "flex flex-1 items-center justify-between gap-2 md:justify-end">
                  <nav className = "flex items-center gap-0.5">
                      <ShoppingCartSideBar courses = {courses}/>
                  </nav>
                </div>
            </div>
        </div>
      </div>    
      {/*Navbar wrapper.*/}
      

   </>
}