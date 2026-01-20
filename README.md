# NEVA.ai

## Image-to-Video Generative AI Application

NEVA.ai is a full-stack Generative AI application that generates a themed video from a real-time image captured via a webcam.
The application intelligently combines computer vision, prompt engineering, and AI-based video generation to produce videos that explicitly match the user’s theme and characteristics.

## Purpose of NEVA.ai

NEVA.ai is a full-stack image-to-video Generative AI system designed to transform a real-time captured image into a themed video, using AI-driven prompt selection and diffusion-based video generation.

## Architecture Overview

Webcam Image + User Input
        ↓
Frontend (React.js)
        ↓
Backend API (FastAPI)
        ↓
Gender Detection (Hugging Face Model)
        ↓
Prompt Selection
        ↓
Image + Prompt → Video Generation
        ↓
Generated Video Output


## Technologies Used

### Frontend

ReactJS

TailwindCSS

Axios (API communication)

### Backend

Python

FastAPI

### AI / ML

Hugging Face Models (Gender Detection)

AnimateDiff (Diffusion-based Image-to-Video generation)

## Clone the Repository

git clone https://github.com/Ashbipbinu/NEVA.ai.git
cd NEVA.ai

## How to Run the Project

### Backend Setup
1. Create a virtual environment:

conda create -n neva python=3.10 -y
conda activate neva

2. Install backend dependencies:

pip install -r requirements.txt

3. Create a .env file in the root directory:

HF_API_KEY=your_huggingface_api_key

Please note:- Do not commit the .env file.

4. Start the backend server:

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000



## Author

Ashbi P Binu
Full-Stack & AI Developer
Project: NEVA.ai
