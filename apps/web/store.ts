// store.ts
import { create } from "zustand";

type WorkflowType = "text2img" | "img2img" | "upscaling";

interface AppState {
  workflowType: WorkflowType;
  setWorkflowType: (type: WorkflowType) => void;
  positivePrompt: string;
  setPositivePrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  cfgScale: number;
  setCfgScale: (scale: number) => void;
  steps: number;
  setSteps: (steps: number) => void;
  denoisingStrength: number;
  setDenoisingStrength: (strength: number) => void;
  highResFix: boolean;
  setHighResFix: (enabled: boolean) => void;
  enhancePrompts: boolean;
  setEnhancePrompts: (enabled: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  workflowType: "text2img",
  setWorkflowType: (type) => set({ workflowType: type }),
  positivePrompt: "",
  setPositivePrompt: (prompt) => set({ positivePrompt: prompt }),
  negativePrompt: "",
  setNegativePrompt: (prompt) => set({ negativePrompt: prompt }),
  cfgScale: 7.5,
  setCfgScale: (scale) => set({ cfgScale: scale }),
  steps: 25,
  setSteps: (steps) => set({ steps }),
  denoisingStrength: 0.7,
  setDenoisingStrength: (strength) => set({ denoisingStrength: strength }),
  highResFix: false,
  setHighResFix: (enabled) => set({ highResFix: enabled }),
  enhancePrompts: false,
  setEnhancePrompts: (enabled) => set({ enhancePrompts: enabled }),
}));
