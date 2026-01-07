from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status

from Utils.gender_predictor import predict_gender
from Utils.read_img import save_upload_file
from Utils.prompts_selector import prompt_selector

import logging

logger = logging.getLogger(__name__)

app = FastAPI()

# This method is used for the processing the image which in turn generates the video
@app.post('/generate-video')
async def generate_video(img: UploadFile = File(...), opt_txt:str = Form(None), theme:str = Form(...)):
        
        try:
            #If the third-party model not detecting the gender
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
            
              
        except Exception as e:
              
              logger.exception("Unexpected error happened")
              raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error occured: {str(e)}"
              )
        
        else:
              pass
        
        finally:
             img.close()