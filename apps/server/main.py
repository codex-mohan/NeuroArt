import time, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI(title="NeuroArt", description="NeuroArt API",version="0.1.0")
app.include_router(generate_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.add_middleware(LoggingMiddleware)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)