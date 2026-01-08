from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from Utils.gender_predictor import predict_gender
from Utils.read_img import save_upload_file
from Utils.prompts_selector import prompt_selector
from Utils.get_local_IP import get_local_ip


import logging

logger = logging.getLogger(__name__)
 
app = FastAPI()
app.mount("/videos", StaticFiles(directory="output_video"), name="videos")

origins = origins = [
    "http://localhost:5173",  # frontend development server
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,     
    allow_methods=["*"],                # Allow all standard HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],                # Allow all headers
)

class VideoRequest(BaseModel):
     img: str
     opt_txt: str = None
     theme: str

OUTPUT_DIR = "output_video"
VIDEO_FILENAME = "giphy.mp4"

@app.get("/video/{filename}")
def serve_video(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video not found")

    return FileResponse(
        path=file_path,
        media_type="video/mp4",
        filename=filename,
    )

# This method is used for the processing the image which in turn generates the video
@app.post('/generate-video')
async def generate_video(request: VideoRequest):
        
        img = request.img
        opt_txt = request.opt_txt
        theme = request.theme

        try:
            # If the third-party model not detecting the gender
            save_img = await save_upload_file(img)
            gender = predict_gender(save_img)
            prompt = prompt_selector(gender, theme, opt_txt) 

            # If there is a theme and it doesnt contains any content
            if not theme or len(theme.strip()) == 0:
                return HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Theme is required"
                )
            
            # If the model not predicting the gender of the image
            if gender is None:
              return HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Gender classification is missing"
              )
            
            # Once the model generated the output vide sucessfully, created a directory with filename "output_video" 
            # and returns the path for the same to the frontend

            video_url = "http://127.0.0.1:8000/videos/sample.mp4"

            video_filename = 'sample.mp4'

            local_ip = get_local_ip()  # dynamically get your PC IP
            print(local_ip)
            video_url = f"http://{local_ip}:8000/videos/{video_filename}"

            return {
                 "success": True,
                 "video_url": video_url
            }
            
              
        except Exception as e:
              
              logger.exception("Unexpected error happened")
              raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error occured: {str(e)}"
              )
                   