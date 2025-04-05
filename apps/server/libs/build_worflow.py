import re, orjson as json

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
    sequences = ['"', "'", "\\"]

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