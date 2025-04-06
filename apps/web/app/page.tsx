"use client";

import React, { useEffect, useState, useRef } from "react";
import { NavigationBar } from "components/NavigationBar";
import { HeroSection } from "components/HeroSection";
import { SettingsPanel } from "components/SettingsPanel";
import { ImagePreview } from "components/ImagePreview";

interface Bubble {
  id: number;
  size: number;
  x: number; // pixels
  y: number; // pixels
  vx: number; // pixels per frame
  vy: number;
}

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth; // 1200px
    const containerHeight = containerRef.current.clientHeight;

    // Generate 20 bubbles with random properties
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 200) + 50, // 50px to 250px
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      vx: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25 px/frame for slow movement
      vy: (Math.random() - 0.5) * 0.5,
    }));
    setBubbles(newBubbles);

    // Animation loop
    const animate = () => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          let newX = bubble.x + bubble.vx;
          let newY = bubble.y + bubble.vy;

          // Bounce on edges
          if (
            newX - bubble.size / 2 <= 0 ||
            newX + bubble.size / 2 >= containerWidth
          ) {
            bubble.vx = -bubble.vx;
          }
          if (
            newY - bubble.size / 2 <= 0 ||
            newY + bubble.size / 2 >= containerHeight
          ) {
            bubble.vy = -bubble.vy;
          }

          // Update position with new velocity
          newX = bubble.x + bubble.vx;
          newY = bubble.y + bubble.vy;

          // Clamp positions to stay within bounds
          newX = Math.max(
            bubble.size / 2,
            Math.min(containerWidth - bubble.size / 2, newX)
          );
          newY = Math.max(
            bubble.size / 2,
            Math.min(containerHeight - bubble.size / 2, newY)
          );

          return { ...bubble, x: newX, y: newY };
        })
      );
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div id="webcrumbs">
      <div
        ref={containerRef}
        className="w-full bg-gray-950 min-h-screen font-sans text-white relative overflow-hidden"
      >
        {/* Animated Bubble Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-20 blur-xl"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                transform: "translate(-50%, -50%)", // Center the bubble at (x, y)
              }}
            />
          ))}
        </div>

        <NavigationBar />

        <main className="relative z-10 px-8 py-10">
          {/* Authentication Modal - Initially Hidden */}
          <div className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 z-50">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Account</h2>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
                <button className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-md font-medium transition-all duration-300 transform hover:scale-[1.02]">
                  Sign Up
                </button>
              </div>
              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a
                  href="https://webcrumbs.cloud/placeholder"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>

          <HeroSection />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SettingsPanel />
            <ImagePreview />
          </div>
        </main>

        {/* Style for the bubble animation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes floatBubble {
              0% {
                transform: translate(-50%, -50%) translateY(0);
              }
              50% {
                transform: translate(-50%, -50%) translateY(-20px);
              }
              100% {
                transform: translate(-50%, -50%) translateY(0);
              }
            }
          `,
          }}
        />
      </div>
      {/* Global Styles for Slider and Scrollbar */}
      <style jsx global>{`
        /* Custom slider styling with Tailwind pink-600 to purple-600 */
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #db2777, #7e22ce);
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid transparent;
          cursor: pointer;
          margin-top: -4px;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid transparent;
          cursor: pointer;
        }
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #6366f1, #f472b6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-button {
          background: transparent;
          width: 12px;
          height: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-button:vertical:increment {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpolygon points='0,0 8,0 4,8' fill='%23ffffff'/%3E%3C/svg%3E")
            center no-repeat;
        }
        .custom-scrollbar::-webkit-scrollbar-button:vertical:decrement {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpolygon points='4,0 0,8 8,8' fill='%23ffffff'/%3E%3C/svg%3E")
            center no-repeat;
        }
      `}</style>
    </div>
  );
};

export default Home;
