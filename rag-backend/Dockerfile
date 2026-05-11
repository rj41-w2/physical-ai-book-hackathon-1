# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for psycopg2 and other libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Hugging Face Spaces usually runs on port 7860
EXPOSE 7860

# Start the application using uvicorn
# We point to main:app and set port to 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
