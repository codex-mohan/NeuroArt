import random,re,os

from rich import print
from models.models import ImageGenerationRequest, UpscaleRequest
from libs.agents import PromptEnhancer, LLMProvider

sampler_mapping = {
    "Euler": {"sampler": "euler", "scheduler": "karras"},
    "Euler a": {"sampler": "euler_ancestral", "scheduler": "karras"},
    "Heun": {"sampler": "heun", "scheduler": "karras"},
    "LMS": {"sampler": "lms", "scheduler": "karras"},
    "DPM2": {"sampler": "dpm2", "scheduler": "Karras"},
    "DPM2 a": {"sampler": "dpm2_ancestral", "scheduler": "karras"},
    "DPM Fast": {"sampler": "dpm_fast", "scheduler": "Karras"},
    "DPM Adaptive": {"sampler": "dpm_adaptive", "scheduler": "karras"},
    "DPM++ SDE Karras": {"sampler": "dpmpp_sde", "scheduler": "karras"},
    "DPM++ 2M Karras": {"sampler": "dpmpp_2m", "scheduler": "karras"},
    "DPM++ 2M SDE Karras": {"sampler": "dpmpp_2m_sde", "scheduler": "karras"},
    "DPM++ 3M SDE Karras": {"sampler": "dpmpp_3m_sde", "scheduler": "karras"},
    "DPM++ 3M SDE Exponential": {"sampler": "dpmpp_3m_sde", "scheduler": "exponential"},
    "DPM++ 2S a Karras": {"sampler": "dpmpp_2s_ancestral", "scheduler": "karras"},
    "LCM": {"sampler": "lcm", "scheduler": "karras"},
    "DDIM": {"sampler": "ddim", "scheduler": "karras"},
    "PLMS": {"sampler": "plms", "scheduler": "karras"},
    "UniPC": {"sampler": "uni_pc", "scheduler": "normal"},
}

resolution_mapping = {
    "1024x1024": {"width": 1024, "height": 1024},
    "1152x896": {"width": 1152, "height": 896},
    "896x1152": {"width": 896, "height": 1152},
    "1216x832": {"width": 1216, "height": 832},
    "832x1216": {"width": 832, "height": 1216},
    "1344x768": {"width": 1344, "height": 768},
    "768x1344": {"width": 768, "height": 1344},
    "1536x640": {"width": 1536, "height": 640},
    "640x1536": {"width": 640, "height": 1536},
}

def sanitize_prompts(prompt):
    sequences = ["'", "\\"]

    for i in sequences:
        prompt = prompt.replace(i, ("\\" + i))

    return prompt

def replace_placeholder(json_str, replacements: dict):
    # Compile the regular expression pattern once
    patterns = [
        (re.compile(r"\{\{" + re.escape(replacement) + r"\}\}"), str(value))
        for replacement, value in replacements.items()
    ]

    # Iterate through patterns and perform replacements
    for pattern, value in patterns:
        json_str = re.sub(pattern, value, json_str)

    return json_str

def build_workflow(request: ImageGenerationRequest | UpscaleRequest, **additional_args):
    """Builds the workflow from the the received request"""


    print("[green]current dir:", os.path.abspath(__file__))
    if isinstance(request, ImageGenerationRequest):
        if request.should_enhance_prompts:
            prompt_enhancer = PromptEnhancer(provider=LLMProvider(provider='groq'))
            enhanced_prompt = prompt_enhancer.enhance_prompt(request.prompt)
            request.prompt = enhanced_prompt.prompt

        workflows_folder = os.path.dirname(os.path.abspath(__file__)) + "/workflow_templates"
        image_denoising_strength = 0
        if request.generation_type == "img2img":
            init_image = request.init_image
            image_denoising_strength = request.denoising_strength
            workflow = "img2img.template"
        else:
            init_image = None
            workflow = "txt2img.template"

        model = request.model
        if model is None:
            model = "Flux/flux-1-dev-fp8.safetensors"

        prompt = request.prompt
        negative_prompt = request.negative_prompt

        if request.seed == -1:
            # Set the control After Generate to Random
            seed_control = "randomize"
            # pick a random seed
            seed = random.randint(1, 2**63 - 1)
        else:
            seed = int(request.seed)
            seed_control = "fixed"

        cfg_scale = float(request.cfg_scale) if request.cfg_scale is not None else 1

        steps = request.steps if request.steps is not None else 50

        denoising_strength = request.denoising_strength if request.denoising_strength is not None else 0.5

        height = request.height if request.height is not None else 1024
        width = request.width if request.width is not None else 1024

        sampler = sampler_mapping[request.sampler]["sampler"]
        scheduler = sampler_mapping[request.sampler]["scheduler"]

        width = request.width if request.width is not None else 1024
        height = request.height if request.height is not None else 1024

        hr_model = request.hr_model if request.hr_model is not None else "None"
        hr_denoising_strength = request.hr_denoising_strength if request.hr_denoising_strength is not None else 0
        hr_steps = request.hr_steps if request.hr_steps is not None else 10

        placeholder_mappings = {
            "Model": model,
            "Prompt": prompt,
            "NegativePrompt": negative_prompt,
            "InitImage": init_image,
            "Seed": seed,
            "CFGScale": cfg_scale,
            "Steps": steps,
            "DenoisingStrength": denoising_strength,
            "Height": height,
            "Width": width,
            "Sampler": sampler,
            "Scheduler": scheduler,
            "SeedControl": seed_control,
            "ImageDenoisingStrength": image_denoising_strength,
            "HRModel": hr_model,
            "HRDenoisingStrength": hr_denoising_strength,
            "HRSteps": hr_steps,
            "HRScale": request.hr_scale,
            **additional_args
        }

        print(os.curdir)
        workflow_str = open(os.path.join(workflows_folder, workflow), "r").read()
        workflow_str = replace_placeholder(workflow_str, placeholder_mappings)

        # Save the generated workflow as a .json file
        with open("workflow.json", "w") as f:
            f.write(workflow_str)

        return workflow_str



