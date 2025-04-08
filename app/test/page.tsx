"use client";
import Navbar from "@/components/Navbar"
import {TypeAnimation} from "react-type-animation";

import Image from 'next/image';

import tempImage from "@/app/sjsu image.png"
import tempHomeImage from "@/app/temp picture for home.png"
import courseGIF from "@/public/homepage_tempGIF.gif"

export default function TestPage(){
  {/*https://tailwindcss.com/ */}
  {/*NOTE: Remove the borders for most of the outside divs. */}  

    // Colors used: slate-900, slate-500, blue-500, yellow-500, cyan-600 through 700
    
    //FOLLOW: https://dribbble.com/shots/24820686-Finpay-Fintech-Landing-Page

   return <>
      <Navbar></Navbar>
  
      {/*Main screen. p-10 has padding left and right, maybe just change to have columns surround it.*/} 
      <div className="pl-10 pt-2 pr-10 gap-24 pb-24 text-gray-950 md:pb-40 dark:text-white bg-slate-900">

        {/*Big front page title.*/} 
            <div className = "rounded-lg mt-20 p-10 text-4xl tracking-tighter text-balance max-lg:font-medium max-sm:px-4 sm:text-5xl lg:text-6xl xl:text-8xl border-t border-l-blue-500/50">
                
                <h1 className = "text-white ml-10 pl-20 ">

                    Find 
                    <span className = "text-yellow-500"> YOUR </span> 
                    SJSU courses 
                    <span className = "text-blue-500"> fast </span>
                    and 
                    <span className = "text-blue-500"> efficiently </span> 
                    with 
                    <span className = "text-yellow-500"> AI</span>.
                    {/*OR, fastforward your SJSU schedule with AI.*/} 
                    <hr className = "border-1 border-blue-500/50"></hr>
                </h1>
                
                <h1 className = "rounded-md p-2 pb-2 mt-4 ml-[6.5%] tracking-tight decoration-1 underline underline-offset-2 text-slate-500 whitespace-nowrap border-r-4 border-r-white pr-5 text-4xl">
                    <span className = "text-cyan-600">Discover </span> 
                    your desired classes 
                    <span className = "text-cyan-600"> NOW</span>.
                </h1>
            </div>
            
            {/* Contains typewriter and the "for sjsu students" text */}
            <div className = "pt-4 pb-2 border-l-2 border-t border-blue flex flex-row">
                
                <button className ="place-self-center p-4 pl-8 pr-8 min-w-1 ml-[10%] items-center justify-center bg-slate-600 rounded-full">
                    <span className = "text-xl text-yellow-500">Get started</span>
                    {/* Include image here of arrow */}
                </button>   

                <div className = "place-self-center p-5 min-w-1 ml-[5%] items-center justify-center text-3xl border-2 rounded-2xl">

                    <p className = "text-white"> Search: <span> </span>  
                        <TypeAnimation
                            sequence={[
                            // Same substring at the start will only be typed out once, initially
                            'CS 151',
                            2000, 
                            'Object Oriented Programming',
                            2000,
                            'Data Structures and Algorithms.',
                            2000,
                            'Data Structures and Algorithms NO DAVID TAYLOR!!',
                            2000]}
                            wrapper="span"
                            speed={50}
                            className = "text-blue-500 text-center"
                            repeat={Infinity}
                        />
                    </p>
                    
                </div>

                {/*Little text.*/} 
                <div className = "text-white place-self-end flex h-16 ml-auto mr-20 max-w-xs items-center px-2 font-serif text-2xl text-blue/10 max-sm:px-4 sm:h-24 border-r-2 border-blue-500/50">
                    <p>Made by 
                        <span className = "font-bold text-yellow-500"> SJSU</span> 
                        <span className = "font-bold text-blue-500"> students</span> 
                        , for 
                        <span className = "font-bold text-yellow-500"> SJSU </span> 
                        <span className = "font-bold text-blue-500">Students.</span>
                    </p>
                </div>

            </div>

            {/* Eyecatching HomeScreen image 
            
                -Use resizeable component to show a BEFORE and AFTER image of the websites.
            
            */}
            <div className = "mt-[1%] mb-[1%] pt-[3%] pb-[3%] border-t">
                <Image src={courseGIF} className = "m-auto border border-slate-600" width={1040} height={620} alt="Temp" />;
            </div>
            

            {/* Section 1: Better than the scheduler. */}
            <div className = "bg-slate-900 border-4 rounded-lg">

                {/*Better than Original SJSU scheduler.*/} 
                <div className = "mt-20 pl-20 border-l-2 border-blue-500/50">
                    
                    <h1 className = "text-yellow-500 tracking-tighter text-balance max-lg:font-medium max-sm:px-3 sm:text-3xl lg:text-4xl xl:text-6xl ">
                        Better than the Original.
                    </h1>
                    <hr ></hr>
                    
                    <p className = "pl-10 mt-3">
                        <span className = "font-bold text-sm text-blue-500/40 tracking-tight">
                            No more dilly dally. Only you and the right courses. 
                        </span>
                    </p>
                    

                    {/*Show before of why original SJSU thing sucks.*/} 
                    <div className = "text-xl mt-0 max-w-xl pt-1 ....border border-blue-500 rounded-lg">
                        <p className = "pl-5 p-2 border-l text-white">
                            This is so good because of random stuff and etc.
                            This is so good because of random stuff and etc.
                            This is so good because of random stuff and etc.
                        </p>
                    </div>
                    
                </div>
                {/* Overlay for User interface. */}
                <div className = "p-4 pl-20 mt-10 bg-slate-800">

                {/*Better user interface.*/} 
                    <div className = "bg-slate-900 rounded-lg flex flex-row w-auto border border-blue-500/50">

                        
                        <Image src={tempImage} className = "m-auto"alt="Temp" width={204} height={204} />
                        <div className = "p-10 text-2xl tracking-tighter text-balance border-r-4 border-white">
                            <h1 className = "underline underline-offset-8 text-blue-500 font-medium max-lg:font-medium max-sm:px-4 sm:text-2xl lg:text-3xl xl:text-4xl">
                                Better User Interface.
                            </h1>
                            <p className = "pt-4">
                                    test
                            </p>

                            {/*Show before of why original SJSU thing sucks.*/} 
                            <div className = "max-w-4xl p-5 ....border border-blue-500 rounded-lg">
                                <p className = "text-white">
                                    Write something on how interface is much better and sleeker.
                                    Okay, it’s not exactly cutting edge, but just throw a screen size in front of 
                                    literally any utility to apply it at a specific breakpoint.dsadsadsadsadsadas
                                </p> 
                            </div>
                        </div>
                        <Image src={tempImage} className = "m-auto "alt="Temp" width={204} height={204} />;
                    </div>
                </div>
                


                {/*Better user search.*/} 
                <div className = "mt-20 pr-20 p-5 text-2xl tracking-tighter text-balance border border-blue-500/50">
                    <h1 className = "place-self-end underline underline-offset-8 text-blue-500 pl-20 font-medium max-lg:font-medium max-sm:px-4 sm:text-2xl lg:text-3xl xl:text-5xl">
                        Better Search.
                    </h1>
                    
                    <div className = "place-self-end pt-4 text-xl mt-0 max-w-xl ....border border-blue-500 rounded-lg">
                        <p className = "text-white">
                            This is so good because of random stuff and etc.
                            This is so good because of random stuff and etc.
                            This is so good because of random stuff and etc.
                        </p>
                    </div>
                </div>

            </div>
            

      </div>

   </>
}