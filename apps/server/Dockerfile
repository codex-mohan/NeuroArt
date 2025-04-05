FROM nvcr.io/nvidia/pytorch:23.10-py3

WORKDIR /app

# Install backend dependencies
COPY apps/backend/requirements.txt .
RUN pip install -r requirements.txt

COPY apps/backend .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]