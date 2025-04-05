# create a fast api route for generating images
from fastapi import APIRouter, Depends, HTTPException
from models.models import ImageGenerationRequest
from pydantic import BaseModel
from typing import List
from libs.agents import PromptEnhancer, LLMProvider, EnhancedPromptType

router = APIRouter()

@router.post("/generate")
async def generate_images(image_generation_request: ImageGenerationRequest):
    if image_generation_request.should_enhance_prompts:
        prompt_enhancer = PromptEnhancer(provider=LLMProvider(provider='googleai'))
        enhanced_prompt = await prompt_enhancer.enhance_prompt(image_generation_request.prompt)
        image_generation_request.prompt = enhanced_prompt.prompt

    # Generate the image
    

    # Generate the image 
    return {"message": "Images generated successfully"}