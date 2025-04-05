from fastapi import FastAPI, Depends, HTTPException

from dotenv import load_dotenv

# Loads the .env variables
load_dotenv()