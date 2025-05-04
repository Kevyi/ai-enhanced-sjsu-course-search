"use client";
import Navbar from "@/components/Navbar"
import {TypeAnimation} from "react-type-animation";
import { useEffect, useState } from 'react';

import Image from 'next/image';
import tempImage from "@/app/sjsu image.png"
import tempHomeImage from "@/app/temp picture for home.png"
import courseGIF from "@/public/homepage_tempGIF.gif"
import { SectionWithRMP } from "@/lib/sjsu/types";

export default function HomePage({courses} : {courses: SectionWithRMP[]}){
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
  {/*https://tailwindcss.com/ */}
  {/*NOTE: Remove the borders for most of the outside divs. */}  

    // Colors used: slate-900, slate-500, blue-500, yellow-500, cyan-600 through 700
    
    //FOLLOW: https://dribbble.com/shots/24820686-Finpay-Fintech-Landing-Page


    

    useEffect(() => {
        // Trigger animation after mount
        const timer1 = setTimeout(() => setShow1(true), 100); // slight delay to allow transition
        const timer2 = setTimeout(() => setShow2(true), 150); // longer delay to allow transition
        const timer3 = setTimeout(() => setShow3(true), 175 ); // longer delay to allow transition

        return () => {clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3)};
    }, []);

    const transitionCSS1 = `${show1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
    const transitionCSS2 = `${show2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
    const transitionCSS3 = `${show3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
    const violetTextGradient = `bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent`;
    const blueTextGradient = `bg-gradient-to-r from-purple-800 via-violet-500 to-blue-600 bg-clip-text text-transparent`;
    const goldTextGradient = `bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400 bg-clip-text text-transparent`;

   return <>
    <header className="w-full fixed top-0 z-50">
            <Navbar scroll={true} courses = {courses}/>
    </header>      
      
      {/*Main screen. p-10 has padding left and right, maybe just change to have columns surround it.*/} 
      <div className="pl-10 pt-2 pr-10 gap-24 pb-24 text-gray-950 md:pb-40 dark:text-white bg-slate-900">
        {/*Landing DIV section.*/} 
        <section className = "h-screen flex flex-col items-center justify-center relative">
       
            <div className = "rounded-lg pt-5 text-4xl tracking-tighter text-balance max-lg:font-medium max-sm:px-4 sm:text-5xl lg:text-6xl xl:text-8xl border-t border-l-blue-500/50">
                {/* Title and subtitle*/}
                <div className = {``}>
                    {/* Title */}
                    <h1 className = {`text-white transition-all duration-3500 ease-out ${transitionCSS1}`} >
                        Find 
                        <span className = {`${goldTextGradient}`}> YOUR </span> 
                        SJSU courses 
                        <span className = {`${blueTextGradient}`}> fast </span>
                        and 
                        <span className = {`${goldTextGradient}`}> efficiently </span> 
                        with 
                        <span className = {`${goldTextGradient}`}> AI</span>.
                        {/*OR, fastforward your SJSU schedule with AI.*/} 
                        <hr className = "border-1 border-blue-500/50"></hr>
                    </h1>
                    {/* Subtitle */}
                    <h3 className = {`text-4xl rounded-md tracking-tight decoration-1 underline underline-offset-2 text-slate-500 whitespace-nowrap border-r-4 border-r-white transition-all duration-3500 ease-out ${transitionCSS2}`}>
                        <span className = "text-cyan-600">Discover </span> 
                        your desired classes 
                        <span className = {`${violetTextGradient}`}> NOW</span>.
                    </h3>    
                </div>
            </div>

                        {/* Little text.  */}
            <div className = {`ml-auto max-h-fit text-white items-center px-2 font-serif text-2xl text-blue/10 max-sm:px-4 sm:h-24 border-r-2 border-blue-500/50 transition-all duration-2500 ease-out ${transitionCSS3}`}>
                <p>Made by 
                    <span className = {`${goldTextGradient} font-bold`}> SJSU</span> 
                    <span className = "font-bold text-blue-500"> students</span> 
                    , for 
                    <span className = {`${goldTextGradient} font-bold`}> SJSU </span> 
                    <span className = "font-bold text-blue-500">Students.</span>
                </p>
            </div>
            
            {/* Contains typewriter and the "for sjsu students" text */}
            <div className = {`min-w-[60%] border-l-2 border-t border-blue flex ml-[10%] mr-auto mb-4 transition-all duration-2500 ease-out ${transitionCSS3}`}>
                
                {/* Include image here of arrow */}
                <a className="place-self-center p-4 pl-8 pr-8 min-w-fit ml-[5%] items-center justify-center bg-slate-600 rounded-full transition duration-500 ease-in-out hover:bg-sky-900" href="/courseTest">
                    <span className = "text-xl text-yellow-500 font-bold">Get started</span>
                </a>
                
                <div className = "min-w-full p-5 flex text-white max-lg:font-medium max-sm:px-4 sm:text-1xl lg:text-2xl xl:text-3xl">
                    <span className = "m-auto">Search:</span> 
                    <p className = "ml-5 p-2 border-2 rounded-2xl min-w-full">
                            <TypeAnimation
                                sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'CS 151',
                                2000, 
                                'Object Oriented Programming',
                                2000,
                                'Data Structures and Algorithms.',
                                2000,
                                'Data Structures and Algorithms',
                                2000]}
                                wrapper="span"
                                speed={50}
                                className = "text-blue-500 text-center"
                                repeat={Infinity}
                            />
                    </p>
                    
                </div>

            </div>

            <div className = "text-white border min-w-full"> 
                
            </div>

            {/* Eyecatching HomeScreen image 
            
                -Use resizeable component to show a BEFORE and AFTER image of the websites.
            
            */}
        </section>

            

        
        <div id = "nextSection" className = "p-2">
            {/* id=nextSection indicates where navbar appears*/}
            <div  className = "mt-[1%] mb-[1%] pt-[3%] pb-[3%] border-t">
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

    </div>
                    
   </>
}