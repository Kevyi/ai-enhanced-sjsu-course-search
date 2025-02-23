"use client";

import Image from 'next/image';
import tempImage from "@/app/sjsu image.png"

export default function Navbar(){
const buttonStyling = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8 px-0";

   return <>
      {/*Navbar wrapper.*/}
      <div className = "container-wrapper bg-blue-400 border-b-4 border-b-blue-500/50 font-[Open_Sans]">
          {/*Component wrapper in navbar.*/}
          <div className = "p-5 container flex h-14 items-center m-auto">

              {/*This is where the Logo and webpage name goes.*/}
              <div className = "mr-4 hidden md:flex">
                <a href = "/home" className = "mr-4 flex items-center gap-2 lg:mr-6">
                  {/*Click logo or name to go to home.*/}
                  <Image src={tempImage} className = "mr-5"alt="Temp" width={30} height={30} />
   
                  <span className = "hidden font-bold lg:inline-block text-2xl text-white"> SJSU Searchify</span>

                </a>
                
                {/*Lists a bunch of navigation*/}
                <nav className = "flex items-center gap-4 text-sm xl:gap-6">
                  <a className = "transition-colors hover:text-foreground/80 text-foreground/80" href = "somewhere">
                      <span className = "font-semibold text-yellow-500">
                        Nav 1
                      </span>
                  </a>

                  <a className = "transition-colors hover:text-foreground/80 text-foreground/80" href = "somewhere">
                      <span className = "font-semibold text-yellow-500">
                        Nav 2
                      </span>
                  </a>

                  <a className = "transition-colors hover:text-foreground/80 text-foreground/80" href = "somewhere">
                      <span className = "font-semibold text-yellow-500">
                        Nav 3
                      </span>
                  </a>
                </nav>
              </div>

              <div className = "flex flex-1 items-center justify-between gap-2 md:justify-end">
                <nav className = "flex items-center gap-0.5">
                    <a target = "blank" className = {buttonStyling}
                        href = "https://google.com">
                        Github or something, or register or login.
                    </a>
                </nav>
              </div>

          </div>
      </div>
   

   </>
}