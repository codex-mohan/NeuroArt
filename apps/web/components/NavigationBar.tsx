// NavigationBar.tsx
import Image from "next/image";
import React from "react";
import { HelpCircle, Bell } from "lucide-react";
import logo from "public/logo.svg";

export const NavigationBar = () => {
  return (
    <nav className="relative z-10 px-8 py-4 flex justify-between items-center border-b border-gray-800 bg-gray-900/70 backdrop-blur-md">
      <div className="flex items-center space-x-2">
        {/* Load svg logo from assets */}
        <Image src={logo} alt="logo" width={40} height={40} />
        <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 z-10">
          NeuralArt
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <details className="relative">
          <summary className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-300 cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white">
            <HelpCircle className="h-5 w-5" />
            <span>Help</span>
          </summary>
          <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-lg shadow-xl p-3 transform origin-top-right transition-all duration-300 z-50">
            <div className="py-1">
              <a
                href="https://webcrumbs.cloud/placeholder"
                className="block px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-300 rounded-md transition-colors duration-200"
              >
                Documentation
              </a>
              <a
                href="https://webcrumbs.cloud/placeholder"
                className="block px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-300 rounded-md transition-colors duration-200"
              >
                Tutorials
              </a>
              <a
                href="https://webcrumbs.cloud/placeholder"
                className="block px-4 py-2 text-sm text-white hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-300 rounded-md transition-colors duration-200"
              >
                FAQ
              </a>
            </div>
          </div>
        </details>

        <button className="p-2 rounded-lg transition-colors duration-300 bg-transparent hover:bg-gray-700">
          <Bell className="h-6 w-6 text-white" />
        </button>

        <div className="h-8 w-px bg-gray-700"></div>

        <button className="px-4 py-2 rounded-lg transition-colors border-0 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 text-white">
          Sign In
        </button>
      </div>
    </nav>
  );
};
