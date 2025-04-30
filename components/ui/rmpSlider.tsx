import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";    

function RmpSlider() {
  const [score, setScore] = useState(5);
  const [starAmount, setStars] = useState();

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScore(parseInt(event.target.value, 10));
  };

  return (
    <div className = "flex-col justify-center content-center ml-2 mr-2 accent-pink-400">
      <input
        type="range"
        min="0"
        max="5"
        value={score}
        onChange={handleSliderChange}
      />
      <div className="flex justify-between text-lg m-0 p-0 ">
        {[...Array(score)].map((_, i) => (
          <FaStar className = "text-yellow-500" key={`${i}rmpScoreStar`} />
        ))}

        {[...Array(5- score)].map((_, i) => (
          <FaStar key={`${i}rmpScoreStar`} />
        ))}

      </div>
    </div>
  );
}

export default RmpSlider;