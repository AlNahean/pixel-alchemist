import torch
import cv2
import numpy as np
import uvicorn
import uuid
import os

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import aiofiles

# --- Configuration ---
# Create directories if they don't exist
os.makedirs("static/uploads", exist_ok=True)

# --- MiDaS Model Loading ---
# This part is crucial: we load the model only ONCE when the app starts.
def load_midas_model(model_type="DPT_Hybrid"):
    """Loads the MiDaS model and the corresponding transform."""
    print(f"Loading MiDaS model: {model_type}...")
    try:
        model = torch.hub.load("intel-isl/MiDaS", model_type)
        
        # Determine device (use GPU if available)
        device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
        model.to(device)
        model.eval()
        print(f"Model loaded successfully on {device}.")

        # Load the appropriate transform
        midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
        transform = midas_transforms.dpt_transform if "dpt" in model_type.lower() else midas_transforms.small_transform
        
        return model, transform, device
    except Exception as e:
        print(f"Error loading model: {e}")
        # Exit if model can't be loaded, as the app is useless without it.
        exit()

# Load model and transform into global scope
MODEL, TRANSFORM, DEVICE = load_midas_model()


# --- FastAPI App Initialization ---
app = FastAPI(title="Depth Map API")

# --- CORS Middleware ---
# This allows your React frontend (running on a different port) to talk to this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # The origin of your Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Static File Serving ---
# This makes the 'static' folder accessible via URL (e.g., http://localhost:8000/static/...)
app.mount("/static", StaticFiles(directory="static"), name="static")


# --- API Endpoint ---
@app.post("/process-image/")
async def create_maps(file: UploadFile = File(...)):
    """
    Accepts an image, saves it, generates both a depth map and an edge map,
    and returns URLs for all three.
    """
    # Generate a unique ID for this request to avoid filename conflicts
    request_id = str(uuid.uuid4())
    original_filename = f"{request_id}_original.png"
    depth_filename = f"{request_id}_depth.png"
    edge_filename = f"{request_id}_edge.png"
    
    original_filepath = f"static/uploads/{original_filename}"
    depth_filepath = f"static/uploads/{depth_filename}"
    edge_filepath = f"static/uploads/{edge_filename}"

    # 1. Save the original uploaded image asynchronously
    async with aiofiles.open(original_filepath, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # 2. Process the image to generate a depth map
    # Read the saved image with OpenCV
    img = cv2.imread(original_filepath)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Transform image and predict
    with torch.no_grad():
        input_batch = TRANSFORM(img_rgb).to(DEVICE)
        prediction = MODEL(input_batch)

        # Resize to original image size
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=img_rgb.shape[:2],
            mode="bicubic",
            align_corners=False,
        ).squeeze()

    # Format the output
    depth_map = prediction.cpu().numpy()
    # Normalize for visualization
    output_normalized = cv2.normalize(depth_map, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    output_colored = cv2.cvtColor(output_normalized, cv2.COLOR_GRAY2BGR) # Save as 3-channel for compatibility

    # 3. Save the depth map
    cv2.imwrite(depth_filepath, output_colored)

    # 3. Generate Edge Map (Canny) <<< NEW SECTION
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Blur the image slightly to reduce noise before Canny
    blurred_img = cv2.GaussianBlur(gray_img, (3,3), 0)
    # Apply Canny edge detection
    edges = cv2.Canny(image=blurred_img, threshold1=100, threshold2=200)
    cv2.imwrite(edge_filepath, edges)
    
    # 4. Return all three URLs
    base_url = "http://localhost:8000"
    return {
        "original_url": f"{base_url}/static/uploads/{original_filename}",
        "depth_map_url": f"{base_url}/static/uploads/{depth_filename}",
        "edge_map_url": f"{base_url}/static/uploads/{edge_filename}" # <<< NEW
    }

@app.get("/")
def read_root():
    return {"status": "Image Processing API is running."}

# To run the app: uvicorn main:app --reload
