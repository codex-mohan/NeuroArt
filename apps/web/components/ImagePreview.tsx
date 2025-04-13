import React, { useState, useEffect } from "react";
import { Image, Download, MoreHorizontal } from "lucide-react";
import { useStore } from "../store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export const ImagePreview: React.FC = () => {
  const { generatedImages, setGeneratedImages } = useStore();
  const [selectedImage, setSelectedImage] = useState<string>(
    generatedImages && generatedImages.length > 0
      ? (generatedImages[0] as string)
      : ""
  );

  useEffect(() => {
    if (generatedImages && generatedImages.length > 0) {
      setSelectedImage(generatedImages[0] as string);
    }
  }, [generatedImages]);

  const handleDownload = async () => {
    if (!selectedImage) return;

    const imageUrl = "http://localhost:3636/" + selectedImage;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = selectedImage.split("/").pop() || "image.png"; // suggested name
      link.click(); // triggers the "Save As" dialog

      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <div className="lg:col-span-2 bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-800 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Image Preview</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-all duration-300 flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>

          {/* More Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-all duration-300 flex items-center space-x-2">
                <MoreHorizontal className="h-5 w-5" />
                <span>More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    "http://localhost:3636/" + selectedImage
                  )
                }
              >
                Copy Image URL
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open(
                    "http://localhost:3636/" + selectedImage,
                    "_blank"
                  )
                }
              >
                Open in New Tab
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedImage("")}>
                Clear Preview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex flex-col items-center justify-center">
        {selectedImage ? (
          <img
            src={"http://localhost:3636/" + selectedImage}
            alt="Generated"
            className="w-full max-w-lg object-contain rounded-lg border border-gray-700"
          />
        ) : (
          <div className="w-full max-w-lg aspect-square bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center">
            <Image className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">
              Your generated image will appear here
            </p>
          </div>
        )}

        {/* Thumbnails */}
        {generatedImages && generatedImages.length > 1 && (
          <div className="mt-4 w-full max-w-lg overflow-x-auto">
            <div className="flex space-x-2">
              {generatedImages.map((imgPath, idx) => (
                <img
                  key={idx}
                  src={"http://localhost:3636/" + imgPath}
                  alt={`Thumbnail ${idx}`}
                  className={`h-20 w-20 object-cover rounded border cursor-pointer transition-transform duration-200 ${
                    selectedImage === imgPath
                      ? "border-blue-500 scale-105"
                      : "border-gray-700"
                  }`}
                  onClick={() => setSelectedImage(imgPath)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
