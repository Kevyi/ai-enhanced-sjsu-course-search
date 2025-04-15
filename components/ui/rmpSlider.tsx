import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";    

function RmpSlider() {
  const [score, setScore] = useState(5);
  const [starAmount, setStars] = useState();

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScore(parseInt(event.target.value, 10));
  };

  return (
    <div className = "flex flex-col">
      <input
        type="range"
        min="0"
        max="5"
        value={score}
        onChange={handleSliderChange}
      />
      <div className="flex gap-1 text-yellow-500 text-xl">
        {[...Array(score)].map((_, i) => (
          <FaStar key={`${i}rmpScoreStar`} />
        ))}
      </div>
    </div>
  );
}

export default RmpSlider;