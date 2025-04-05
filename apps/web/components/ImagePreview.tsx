import React from "react";
import { Image, Download, MoreHorizontal } from "lucide-react";

export const ImagePreview: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md rounded-xl border border-gray-800 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">Image Preview</h2>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-full max-w-lg aspect-square bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center group">
          <div className="text-center p-6 transition-all duration-300 group-hover:scale-105">
            <Image className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">
              Your generated image will appear here
            </p>
          </div>
        </div>

        {/* Controls (hidden until an image is generated) */}
        <div className="hidden w-full max-w-lg mt-4 justify-between items-center">
          <button className="py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-all duration-300 flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
          <button className="py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-all duration-300 flex items-center space-x-2">
            <MoreHorizontal className="h-5 w-5" />
            <span>More Options</span>
          </button>
        </div>
      </div>
    </div>
  );
};
