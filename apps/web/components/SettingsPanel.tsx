import React, { useState } from "react";
import { useStore } from "../store";
import {
  Type,
  Image,
  Maximize,
  Upload,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const resolutions = {
  "1:1": [{ label: "1024x1024", width: 1024, height: 1024 }],
  "4:3": [
    { label: "1152x896", width: 1152, height: 896 },
    { label: "1216x832", width: 1216, height: 832 },
    { label: "1344x768", width: 1344, height: 768 },
  ],
  "3:4": [
    { label: "896x1152", width: 896, height: 1152 },
    { label: "832x1216", width: 832, height: 1216 },
    { label: "768x1344", width: 768, height: 1344 },
  ],
  "3:2": [{ label: "1536x1024", width: 1536, height: 1024 }],
  "2:3": [{ label: "1024x1536", width: 1024, height: 1536 }],
  "16:9": [{ label: "1536x640", width: 1536, height: 640 }],
  "9:16": [{ label: "640x1536", width: 640, height: 1536 }],
};

// Real SVG icons for different aspect orientations
const LandscapeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect
      x="3"
      y="8"
      width="18"
      height="8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PortraitIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect
      x="8"
      y="3"
      width="8"
      height="18"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect
      x="6"
      y="6"
      width="12"
      height="12"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getAspectIcon = (width: number, height: number) => {
  if (width === height) return <SquareIcon />;
  return width > height ? <LandscapeIcon /> : <PortraitIcon />;
};

export const SettingsPanel: React.FC = () => {
  const {
    workflowType,
    setWorkflowType,
    positivePrompt,
    setPositivePrompt,
    negativePrompt,
    setNegativePrompt,
    cfgScale,
    setCfgScale,
    steps,
    setSteps,
    denoisingStrength,
    setDenoisingStrength,
    highResFix,
    setHighResFix,
    enhancePrompts,
    setEnhancePrompts,
  } = useStore();

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [creativity, setCreativity] = useState(0.5);
  const [selectedResolution, setSelectedResolution] = useState("1024x1024");
  const [isResolutionOpen, setIsResolutionOpen] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  return (
    <div className="lg:col-span-1 bg-gray-900/70 backdrop-blur-md p-6 rounded-xl border border-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Generation Settings
      </h2>

      {/* Workflow Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Workflow Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["text2img", "img2img", "upscaling"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setWorkflowType(type)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                workflowType === type
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white"
                  : "bg-gray-800 border border-gray-700 hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-300"
              }`}
            >
              {type === "text2img" && <Type className="h-6 w-6 mb-1" />}
              {type === "img2img" && <Image className="h-6 w-6 mb-1" />}
              {type === "upscaling" && <Maximize className="h-6 w-6 mb-1" />}
              <span className="text-sm font-medium capitalize">
                {type.replace("2", " to ")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution Selector (Collapsible) */}
      {(workflowType === "text2img" || workflowType === "img2img") && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Resolution
            </label>
            <button
              onClick={() => setIsResolutionOpen(!isResolutionOpen)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle resolution options"
            >
              {isResolutionOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
          {isResolutionOpen && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {Object.entries(resolutions).map(([aspect, resList]) => (
                <div key={aspect}>
                  <p className="text-gray-400 text-xs font-semibold mb-1">
                    Aspect Ratio {aspect}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resList.map(({ label, width, height }) => (
                      <button
                        key={label}
                        onClick={() => setSelectedResolution(label)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                          selectedResolution === label
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                        }`}
                      >
                        {getAspectIcon(width, height)}
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prompts */}
      {(workflowType === "text2img" || workflowType === "img2img") && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Positive Prompt
            </label>
            <textarea
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              placeholder="Describe what you want to generate..."
              value={positivePrompt}
              onChange={(e) => setPositivePrompt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Negative Prompt
            </label>
            <textarea
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={2}
              placeholder="Describe what you want to avoid..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Img2Img and Upscaling: Image Upload */}
      {(workflowType === "img2img" || workflowType === "upscaling") && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Upload Image
          </label>
          <div
            className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {uploadedImage ? (
              <img
                src={URL.createObjectURL(uploadedImage)}
                alt="Uploaded"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <Upload className="h-8 w-8 mb-2" />
                <span>Drag and drop or click to upload</span>
              </div>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      )}

      {/* Upscaling: Creativity Slider */}
      {workflowType === "upscaling" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Creativity
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={creativity}
            onChange={(e) => setCreativity(parseFloat(e.target.value))}
            className="w-full slider"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>0</span>
            <span>{creativity.toFixed(2)}</span>
            <span>1</span>
          </div>
          <button className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-pink-500 via-orange-400 to-teal-400 hover:from-pink-600 hover:via-orange-500 hover:to-teal-500 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transform hover:scale-105">
            Upscale Image
          </button>
        </div>
      )}

      {/* Common Settings */}
      {workflowType !== "upscaling" && (
        <div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                CFG Scale
              </label>
              <span className="text-sm text-gray-400">{cfgScale}</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={cfgScale}
              onChange={(e) => setCfgScale(parseFloat(e.target.value))}
              className="w-full slider"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Steps</label>
              <span className="text-sm text-gray-400">{steps}</span>
            </div>
            <input
              type="range"
              min="10"
              defaultValue={20}
              max="150"
              step="1"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                Denoising Strength
              </label>
              <span className="text-sm text-gray-400">{denoisingStrength}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={denoisingStrength}
              onChange={(e) => setDenoisingStrength(parseFloat(e.target.value))}
              className="w-full slider"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={highResFix}
                onChange={(e) => setHighResFix(e.target.checked)}
              />
              <div className="relative w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500 transition-colors duration-300" />
              <div className="relative w-3.5 h-3.5 bg-white rounded-full -left-12 peer-checked:translate-x-5 transition-transform duration-300" />
              <span className="text-sm font-medium text-gray-300">
                HighRes Fix
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={enhancePrompts}
                onChange={(e) => setEnhancePrompts(e.target.checked)}
              />
              <div className="relative w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500 transition-colors duration-300" />
              <div className="relative w-3.5 h-3.5 bg-white rounded-full -left-12 peer-checked:translate-x-5 transition-transform duration-300" />
              <span className="text-sm font-medium text-gray-300">
                Enhance Prompts
              </span>
            </label>
          </div>
          <button className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-pink-500 via-orange-400 to-teal-400 hover:from-pink-600 hover:via-orange-500 hover:to-teal-500 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transform hover:scale-105">
            Generate Image
          </button>
        </div>
      )}

      {/* Global Styles for Slider and Scrollbar */}
      <style jsx global>{`
        /* Custom slider styling with gradient from pink-500 to purple-500 */
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #ec4899, #a855f7);
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
