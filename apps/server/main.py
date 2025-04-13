import time, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from rich import print
from dotenv import load_dotenv

from routes.generate import router as generate_router

# Loads the .env variables
load_dotenv()

PORT = int(os.environ.get("SERVER_PORT", 8000))

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        print(f"[green bold]Request:[cyan] {request.url.path} completed in [yellow]{process_time}[blue] seconds")
        return response

SERVER_URL = os.environ.get("SERVER_URL")

# Allow frontend on port 3001
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
]

app = FastAPI(title="NeuroArt", description="NeuroArt API",version="0.1.0")
app.include_router(generate_router)
app.mount("/output", StaticFiles(directory="/home/mohanakrishna/Git/ComfyUI/output"), name="output")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.add_middleware(LoggingMiddleware)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=PORT)