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
    # 1. Decode OpenCV BGR image
    frame_bgr = decode(payload.image_base64)
    height, width, _ = frame_bgr.shape
    
    # 2. Convert BGR to RGB (MediaPipe requires RGB format)
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    
    # 3. Create MediaPipe Image object
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
    
    # 4. Run object detection
    detection_result = detector.detect(mp_image)
    
    # 5. Format results into clean JSON
    detections = []
    for detection in detection_result.detections:
        category = detection.categories[0]
        bbox = detection.bounding_box
        
        detections.append({
            "label": category.category_name,
            "confidence": round(float(category.score), 2),
            "bounding_box": {
                "x": bbox.origin_x,
                "y": bbox.origin_y,
                "width": bbox.width,
                "height": bbox.height
            }
        })
    
    return {
        "status": "success",
        "image_info": {"width": width, "height": height},
        "detected_count": len(detections),
        "detections": detections
    }