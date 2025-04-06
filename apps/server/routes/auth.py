from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from models.models import User

route = APIRouter(
    prefix="/auth",
    tags=["auth"]
)