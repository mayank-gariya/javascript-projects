import base64
import cv2
import numpy as np
import mediapipe as mp
from fastapi import FastAPI, HTTPException
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

MODEL_PATH = r'D:\javascript-projects\Detect\Detctven\Backend\efficientdet_lite0.tflite'

BaseOptions = mp.tasks.BaseOptions
ObjectDetector = mp.tasks.vision.ObjectDetector
ObjectDetectorOptions = mp.tasks.vision.ObjectDetectorOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = ObjectDetectorOptions(
    base_options=BaseOptions(model_asset_path=MODEL_PATH),
    score_threshold=0.3,
    running_mode=VisionRunningMode.IMAGE
)

detector = ObjectDetector.create_from_options(options)

@app.get('/')
async def health_check():
    return {
        'message':'workingfine',
        'statue':200
    }
    
@app.post("/api/v1/analyze")
async def process_image(payload: ImageModel):
    # Print to verify data arrives
    print("Received payload length:", len(payload.image_base64))
    
    # Your decoding and detection code here...
    return {"status": "success", "detections": []}