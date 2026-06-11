from fastapi import FastAPI, UploadFile, File
import os
import shutil
from fastapi.responses import FileResponse


app = FastAPI(title="NAS Server3", description="A simple NAS server built with FastAPI", version="1.0.0")
STORAGE_PATH = "backend/storage"
os.makedirs(STORAGE_PATH, exist_ok=True)


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "NAS Server3"
    }
    


@app.get("/files")
def list_files():
    files = os.listdir(STORAGE_PATH)

    return {
        "files": files
    }

@app.get("/download/{filename}")
def download_file(filename: str):

    file_path = os.path.join(STORAGE_PATH, filename)

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    return FileResponse(
        path=file_path,
        filename=filename
    )

@app.delete("/delete/{filename}")
def delete_file(filename: str):

    file_path = os.path.join(STORAGE_PATH, filename)

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    os.remove(file_path)

    return {
        "message": f"{filename} deleted"
    }

    

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(STORAGE_PATH, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded",
        "filename": file.filename
    }