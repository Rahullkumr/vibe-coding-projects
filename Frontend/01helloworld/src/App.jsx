import { useEffect, useRef } from "react";

const TEXT = "Hello World";

function App() {
  const lettersRef = useRef([]);

  useEffect(() => {
    // Initial entrance animation for all letters
    if (window.gsap && lettersRef.current.length) {
      window.gsap.fromTo(
        lettersRef.current,
        { y: -100, opacity: 0, rotate: -20 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: "bounce.out",
          stagger: 0.05,
        }
      );
    }
  }, []);

  const handleMouseEnter = () => {
    if (window.gsap && lettersRef.current.length) {
      lettersRef.current.forEach((el, i) => {
        // Animate each letter in a random direction
        window.gsap.to(el, {
          x: (Math.random() - 0.5) * 600, // random left/right
          y: (Math.random() - 0.5) * 400 - 100, // random up/down, more up
          rotate: (Math.random() - 0.5) * 720, // random rotation
          opacity: 0,
          duration: 1 + Math.random(), // random duration
          ease: "power3.in",
          delay: i * 0.03,
        });
      });
    }
  };

  const handleMouseLeave = () => {
    if (window.gsap && lettersRef.current.length) {
      // Bring all letters back to original position
      window.gsap.to(lettersRef.current, {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.03,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <h1
        className="text-5xl font-extrabold text-blue-600 drop-shadow-lg cursor-pointer select-none flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: "transform" }}
      >
        {TEXT.split("").map((char, i) => (
          <span
            key={i}
            ref={el => (lettersRef.current[i] = el)}
            className="inline-block"
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </div>
  );
}

export default App;