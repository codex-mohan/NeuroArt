from pydantic import BaseModel, Field
from typing import Literal, Optional, List

class User(BaseModel):
    username: str;
    email: str = Field(regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str = Field(min_length=10, regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$')

class ImageGenerationRequest:
    model: str = Field(min_length=1, title="Model", description="Model for image generation")
    prompt: str = Field(min_length=1, title="Prompt", description="Prompt for image generation")
    init_image: Optional[List[str]] = Field(title="Init Image", description="path to the Initial Image for image generation", default=None)
    negative_prompt: str = Field(min_length=1, title="Negative Prompt", description="Negative Prompt for image generation")
    should_enhance_prompts: bool = Field(title="Enhance Prompts", description="Ebable/Disable Enhanced Prompts")
    generation_type: Literal['txt2img', 'img2img'] = Field(title="Generation Type",description="Specify the type of Image generation")
    hr_model: str = Field(title="High Resolution Model", description="Refers to the type of High Resolution Model used")
    steps: int = Field(ge=0, lt=100, title="Diffusion Steps", description="Defines the nnumber of steps for the diffusion process")
    denoising_strength: float = Field(ge=0.0, le=1, title="Denosing Strength", description="Determines the amount of noise to be subtracted")
    height: int = Field(gt=0, lt=2048, title="Height", description="Height of the image")
    width: int = Field(gt=0, lt=2048, title="Width", description="Width of the image")
    seed: int = Field(gt=0, lt=4294967295, title="Seed", description="Seed for the random number generator")
    cfg_scale: float = Field(ge=0.0, le=15.0, title="CFG Scale", description="Controls the strength of the guidance")
    pag_scale: float = Field(ge=0.0, le=3.0, title="PAG Scale", description="Controls Perturbed Attention Guidance")

class UpscaleRequest:
    image: str
    scale: int = Field (gt=0, lt=4, title="Scale", description="Scale of the Upscaling")
    creativity: float = Field(ge=0, lt=1.0, default=0.2, title="Creativity", description="Controls the creativity of the Upscaling")
