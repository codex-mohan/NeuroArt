// SettingsPanel.tsx
import React, { useState } from "react";
import { useStore } from "../store";
import { Type, Image, Maximize, Upload } from "lucide-react";

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

  // Local state for Img2Img and Upscaling image upload
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  // Local state for Upscaling creativity
  const [creativity, setCreativity] = useState(0.5);

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

      {/* Workflow Type Selector */}
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

      {/* Settings */}
      <div className="space-y-5">
        {(workflowType === "text2img" || workflowType === "img2img") && (
          <>
            {/* Positive Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Positive Prompt
              </label>
              <textarea
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 resize-none"
                rows={3}
                placeholder="Describe what you want to generate..."
                value={positivePrompt}
                onChange={(e) => setPositivePrompt(e.target.value)}
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Negative Prompt
              </label>
              <textarea
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 resize-none"
                rows={2}
                placeholder="Describe what you want to avoid..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Img2Img and Upscaling: Drag-and-Drop Image Upload */}
        {(workflowType === "img2img" || workflowType === "upscaling") && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Upload Image
            </label>
            <div
              className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
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
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>0</span>
              <span>{creativity.toFixed(2)}</span>
              <span>1</span>
            </div>
          </div>
        )}

        {/* Common Settings */}
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
            className="w-full"
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
            max="150"
            step="1"
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value))}
            className="w-full"
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
            className="w-full"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={highResFix}
              onChange={(e) => setHighResFix(e.target.checked)}
            />
            <div className="relative w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500 transition-colors duration-300"></div>
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
            <div className="relative w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500 transition-colors duration-300"></div>
            <div className="relative w-3.5 h-3.5 bg-white rounded-full -left-12 peer-checked:translate-x-5 transition-transform duration-300" />

            <span className="text-sm font-medium text-gray-300">
              Enhance Prompts
            </span>
          </label>
        </div>

        {/* Generate Button */}
        <button className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-orange-400 to-teal-400 hover:from-pink-600 hover:via-orange-500 hover:to-teal-500 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transform hover:scale-105">
          Generate Image
        </button>
      </div>
    </div>
  );
};
