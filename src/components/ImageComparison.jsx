import React, { useState, useRef } from 'react';

export default function ImageComparison({ before, after, isAr }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const relativeX = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(relativeX, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[300px] sm:h-[400px] overflow-hidden cursor-ew-resize select-none touch-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white shadow-2xl"
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 object-cover h-[300px] sm:h-[400px]" 
          style={{ width: containerRef.current?.offsetWidth || '100%' }} 
        />
        <div className="absolute top-4 left-4 bg-red-600/90 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase backdrop-blur-sm">
          {isAr ? 'قبل' : 'Before'}
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-[#1e3a6e]/90 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase backdrop-blur-sm">
        {isAr ? 'بعد' : 'After'}
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white flex items-center justify-center"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#1e3a6e] border-4 border-[#1e3a6e] hover:scale-110 transition-transform">
          <span className="text-lg font-bold">↔</span>
        </div>
      </div>
    </div>
  );
}