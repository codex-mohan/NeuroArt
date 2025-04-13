import os
import asyncio
from fastapi import APIRouter, HTTPException, Response
from models.models import ImageGenerationRequest
from rich import print
import orjson as json
import httpx
import dotenv
from libs.build_worflow import build_workflow
from fastapi.responses import StreamingResponse

router = APIRouter(tags=["generation"])

dotenv.load_dotenv()

@router.post("/queue", status_code=201)
async def generate_images(image_generation_request: ImageGenerationRequest) -> Response:
    # Build the workflow and convert to dict
    print("image_generation_request", image_generation_request)
    workflow: str = build_workflow(image_generation_request)
    workflow_dict: dict = json.loads(workflow.encode('utf-8'))
    print("workflow_dict", workflow_dict)

    headers = {"Content-Type": "application/json"}
    payload = {"prompt": workflow_dict}

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                "http://127.0.0.1:9560/prompt",
                json=payload,
                headers=headers
            )
            response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Upstream error: {e.response.text}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")

    print("response", response)
    return {
        "message": "Images queued successfully",
        "data": response.json(),
        "status": response.status_code
    }

COMFYUI_PATH = "/home/mohanakrishna/Git/ComfyUI"
RETRY_DELAY = 5
MAX_RETRIES = 50

@router.get("/status-stream/{id}")
async def stream_status(id: str):
    status_url = f"http://127.0.0.1:9560/history/{id}"

    print(f"[green]Comfyui Path Provided: [blue]", COMFYUI_PATH)

    async def status_generator():
        retries = 0
        async with httpx.AsyncClient() as client:
            while retries < MAX_RETRIES:
                try:
                    resp = await client.get(status_url)
                    resp.raise_for_status()
                    data = resp.json()
                    print("data", data)
                except Exception as e:
                    yield f"data: Error contacting ComfyUI: {str(e)}\n\n"
                    await asyncio.sleep(RETRY_DELAY)
                    retries += 1
                    continue

                # If no data, wait and try again.
                if not data or data == {}:
                    yield f"data: Waiting... attempt {retries+1}/{MAX_RETRIES}\n\n"
                    print(f"Waiting... attempt {retries+1}/{MAX_RETRIES}")
                    await asyncio.sleep(RETRY_DELAY)
                    retries += 1
                    continue

                # Get the first key and its corresponding data.
                prompt_id = next(iter(data))
                prompt_data = data[prompt_id]

                # Check if the generation status is "success"
                if prompt_data.get("status", {}).get("status_str") == "success":
                    try:
                        output_images = prompt_data["outputs"]["24"]["images"]
                        image_paths = [
                            os.path.join("output", img["subfolder"], img["filename"])
                            for img in output_images
                        ]
                        print("image_paths", image_paths, "status", prompt_data["status"]["status_str"])
                        yield f"data: {json.dumps({'status': 'completed', 'images': image_paths}).decode('utf-8')}\n\n"
                        return
                    except KeyError:
                        yield "data: Error: Output images not found.\n\n"
                        return

                # If generation is not complete, send a status update and continue polling.
                current_status = prompt_data.get("status", {}).get("status_str", "unknown")
                yield f"data: {json.dumps({'status': current_status}).decode('utf-8')}\n\n"
                await asyncio.sleep(RETRY_DELAY)
                retries += 1

            yield "data: Timeout. Max retries reached.\n\n"

    return StreamingResponse(status_generator(), media_type="text/event-stream")
