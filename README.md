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

HTML Canvas (for webcam capture)

Axios (API communication)

### Backend

Python

FastAPI

Prompt Engineering