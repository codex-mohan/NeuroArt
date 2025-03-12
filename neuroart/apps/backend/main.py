import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from fastapi import FastAPI, Depends, HTTPException

from dotenv import load_dotenv

# Loads the .env variables
load_dotenv()