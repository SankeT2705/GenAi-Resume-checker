import React, { useEffect, useState } from "react";
import "./AnimatedBackground.scss";

const AnimatedBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="animated-bg">
      <div 
        className="gradient-sphere sphere-1"
        style={{ transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)` }}
      ></div>
      <div 
        className="gradient-sphere sphere-2"
        style={{ transform: `translate(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px)` }}
      ></div>
      <div 
        className="gradient-sphere sphere-3"
        style={{ transform: `translate(${mousePos.y * 0.5}px, ${mousePos.x * 0.5}px)` }}
      ></div>
      <div className="starbursts">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`star star-${i + 1}`}></div>
        ))}
      </div>
      <div className="bg-grid"></div>
    </div>
  );
};

export default AnimatedBackground;
