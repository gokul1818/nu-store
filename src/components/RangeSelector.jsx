import { useState } from "react";

export default function PriceRangeSlider({ value = [0, 5000], min = 0, max = 10000, step = 10, onChange }) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(val);
    onChange && onChange([val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(val);
    onChange && onChange([minVal, val]);
  };

  return (
    <div className="w-full">
      <label className="block mb-1">Price Range: ₹{minVal} - ₹{maxVal}</label>
      <div className="relative h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full pointer-events-none appearance-none"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full pointer-events-none appearance-none"
        />

        {/* Track */}
        <div className="absolute h-1 w-full bg-gray-300 top-1/2 -translate-y-1/2 rounded"></div>

        {/* Range Highlight */}
        <div
          className="absolute h-1 bg-orange-500 top-1/2 -translate-y-1/2 rounded"
          style={{
            left: `${(minVal / max) * 100}%`,
            right: `${100 - (maxVal / max) * 100}%`,
          }}
        ></div>

        {/* Handles */}
        <div
          className="absolute w-4 h-4 bg-orange-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
          style={{ left: `${(minVal / max) * 100}%` }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-orange-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
          style={{ left: `${(maxVal / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
