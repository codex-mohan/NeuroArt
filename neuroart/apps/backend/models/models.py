from pydantic import BaseModel, Field
from typing import Literal

class User(BaseModel):
    username: str;
    password: str = Field(min_length=10, regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$')

class ImageGenerationRequest:
    prompt: str = Field(min_length=1, title="Prompt", description="Prompt for image generation")
    generation_type: Literal['txt2img', 'img2img', 'upscaling'] = Field(title="Generation Type",description="Specify the type of Image generation")
    hr_model: str = Field(title="High Resolution Model", description="Refers to the type of High Resolution Model used")
    steps: int = Field(ge=0, lt=100, title="Diffusion Steps", description="Defines the nnumber of steps for the diffusion process")
    denoising_strength: float = Field(ge=0.0, le=1, title="Denosing Strength", description="Determines the amount of noise to be subtracted")