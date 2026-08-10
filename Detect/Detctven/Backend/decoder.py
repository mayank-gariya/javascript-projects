import base64
import cv2
import numpy as np
from fastapi import HTTPException


def decode(base64_str:str)->np.ndarray:
    try:
        if ',' in base64_str:
            base64_url = base64_str.split(',')[1]
        
        img_byte = base64.b64decode(base64_url)
        np_arr = np.frombuffer(img_byte,np.uint8)
        img =  cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Could not decode image")
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image payload: {str(e)}")