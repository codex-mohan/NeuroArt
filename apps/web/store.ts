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
  sampler: string;
  setSampler: (sampler: string) => void;
  steps: number;
  setSteps: (steps: number) => void;
  denoisingStrength: number;
  setDenoisingStrength: (strength: number) => void;
  highResFix: boolean;
  setHighResFix: (enabled: boolean) => void;
  highResModel: string;
  setHighResModel: (model: string) => void;
  highResDenoisingStrength: number;
  setHighResDenoisingStrength: (strength: number) => void;
  highResSteps: number;
  setHighResSteps: (steps: number) => void;
  highResScale: number;
  setHighResScale: (seed: number) => void;
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
  cfgScale: 4.0,
  setCfgScale: (scale) => set({ cfgScale: scale }),
  sampler: "Euler",
  setSampler: (sampler) => set({ sampler }),
  steps: 25,
  setSteps: (steps) => set({ steps }),
  denoisingStrength: 1.0,
  setDenoisingStrength: (strength) => set({ denoisingStrength: strength }),
  highResFix: false,
  setHighResFix: (enabled) => set({ highResFix: enabled }),
  highResDenoisingStrength: 0.3,
  setHighResDenoisingStrength: (strength) =>
    set({ highResDenoisingStrength: strength }),
  highResModel: "4x_foolhardy_Remacri.pth",
  setHighResModel: (model) => set({ highResModel: model }),
  highResSteps: 10,
  setHighResSteps: (steps) => set({ highResSteps: steps }),
  highResScale: 1.5,
  setHighResScale: (seed) => set({ highResScale: seed }),
  enhancePrompts: false,
  setEnhancePrompts: (enabled) => set({ enhancePrompts: enabled }),
}));
