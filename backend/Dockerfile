# Use official lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (if any are needed for your specific packages)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy prompts directory
COPY prompts ./prompts

# Copy application code
COPY app ./app

# Expose port (Cloud Run defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Command to run the application using Uvicorn
# Uses the PORT environment variable injected by Cloud Run
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1
