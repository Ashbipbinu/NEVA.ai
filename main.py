from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status

from Utils.gender_predictor import predict_gender
from Utils.read_img import save_upload_file

import os

app = FastAPI()



# This method is used for the processing the image which in turn generates the video
@app.post('/generate-video')
async def generate_video(img: UploadFile = File(...), opt_txt:str = Form(None), theme:str = Form(...)):


        # If there is a theme and it doesnt contains any content
        if not theme or len(theme.strip()) == 0:
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Theme is required"
            )
        
        #If the third-party model not detecting the gender
        read_img = await save_upload_file(img)
        gender = predict_gender(read_img)

        if gender is None:
              return HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Gender classification is missing"
              )

        return gender