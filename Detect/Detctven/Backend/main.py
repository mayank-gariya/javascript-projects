# fast api code 
import numpy as np
from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from Backend.model import ImageModel
from Backend.decoder import decode

app = FastAPI()

# middelware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def health_check():
    return {
        'message':'workingfine',
        'statue':200
    }

@app.post('api/v1/analyse')
async def process_image(payload:ImageModel):
    # Convert Base64 string to OpenCV BGR matrix
    frame = decode(payload.image_base64)
    
    h,w,c = frame.shape
    
    return {
        "status": "success",
        "image_info": {
            "width": w,
            "height": h,
            "channels": c
        },
        "detections": [],
        "extracted_text": ""
    }