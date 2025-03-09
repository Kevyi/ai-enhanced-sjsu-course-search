import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";



const available : boolean = true;

const SpringModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    // Animated modal
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          {/* motion.div is the actual modal itself. */}
          <motion.div
          // Originally 12.5deg
            //Initial start of degree change.
            initial={{ scale: 0, rotate: "0deg" }}

            //Animate to end of degree change.
            animate={{ scale: 1, rotate: "0deg" }}

            //Exit degree change.
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            //Background color for the modal
            className="bg-gradient-to-br from-slate-800 to-indigo-900 text-white p-6 rounded-lg w-full max-w-6xl shadow-xl cursor-default relative overflow-hidden"
          >
            {/* A little imprint on the plain slab */}
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />

            {/* Holds the entire inside of modal */}
            <div className="relative z-10">
              <div className="max-w-xs mb-2 rounded-full text-5xl text-yellow-500 flex justify-center mx-auto">
                <FaStar />
                <FaStar />
                <FaStar />
                
              </div>
              <h2 className="text-5xl font-bold text-center mb-2">
                Object Oriented Programming
              </h2>

              <h3 className="text-3xl font-bold text-center mb-2">
                <span className = "bg-gradient-to-br from-yellow-600 to-blue-400 bg-clip-text text-transparent">
                  David Taylor 
                </span>
              </h3>

              <p className="text-center mb-6">
                Course Description: random stuff about the courses
              </p>

              {available ? 
               <div className = "hover:opacity-80 transition-opacity max-w-xs pl-2 pr-2 border rounded-lg bg-green-600 ml-auto mr-auto m-3 p-2 text-center">
                    <span>AVAILABLE </span>
                </div>
               :
                <div className = "hover:opacity-80 transition-opacity max-w-xs pl-2 pr-2 border rounded-lg bg-red-800 ml-auto mr-auto m-3 p-2 text-center">
                    <span>Full</span>
                </div> 
                }

              {/* Holds the buttons to go back and add to clipboard. */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full max-w-xs py-2 rounded ml-auto"
                >
                  Back
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white hover:opacity-80 transition-opacity text-blue-600 font-semibold w-full max-w-xs py-2 rounded mr-auto"
                >
                  Copy to clipboard.
                  Add a toast.
                </button>
              </div>
            </div>
            
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpringModal;