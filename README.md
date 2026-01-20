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

    conda create -n neva python=3.10 -y  <br>
    conda activate neva

2. Install backend dependencies:

    pip install -r requirements.txt

3. Create a .env file in the root directory:

    HF_API_KEY=your_huggingface_api_key

    Please note:- Do not commit the .env file.

4. Start the backend server:

    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

### Frontend Setup

1. Navigate to frontend directory:

    cd neva-frontend

2. Install frontend dependencies:

    npm install

3. Start the frontend server:

    npm run dev <br>
    Frontend URL: http://localhost:3000

## How to Use the Application

Follow the steps below to generate a video using NEVA.ai:

1. Open the application in your browser. <br>

    You will see a live preview from your webcam. <br>

2. Capture an image <br>

    Click the Capture button to take a photo using the webcam. <br>
    If you are not satisfied, click Retake to capture the image again. <br>

3. Select a theme <br>

    Choose a video theme from the dropdown menu (e.g., Festive, Avatar, Cartoonify, etc.).

4. Enter an optional prompt <br>

    You may provide additional text input to guide the video generation. <br>
    This step is optional, as the backend already applies prompt engineering. <br>

5. Generate the video <br>

    Click the Generate button to start processing. <br>
    Please wait for a few moments while the AI model generates the video.<br>

6. View the result <br>

    A modal window will appear once the video is ready. <br>
    You can play and preview the generated video inside the modal. <br>

7. Download or share the video <br>

    Click the Download button to save the video locally. <br>
    A QR code is also provided to view the video on your mobile device. <br>

Please Note: Ensure that your mobile phone and the application are connected to the same internet network to access the video via QR code. <br>

## Current Features

    Real-time webcam image capture

    AI-based gender detection

    Automatic prompt selection

    Image-to-video generation using diffusion models

    Video preview and download

## Future Enhancements

    Higher resolution video output

    Additional video themes

    Cloud storage integration

    Mobile application support


## Author

Ashbi P Binu <br>
Full-Stack & AI Developer <br>
Project: NEVA.ai
