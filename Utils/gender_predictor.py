import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

import warnings
warnings.filterwarnings('ignore', category=UserWarning)

load_dotenv()

huggingFace_token = os.getenv("HF_TOKEN")


def predict_gender(img):
    client = InferenceClient(
        provider="hf-inference",
        api_key=huggingFace_token,
    )

    gender = client.image_classification(img, model="rizvandwiki/gender-classification") 

    return gender[0]["label"]

if __name__ == '__main__':
    img = r"F:\NEVA.ai\NEVA.ai\public\images\male.jpg"
    gender = predict_gender(img)