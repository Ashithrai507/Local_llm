from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import os
import json
import shutil
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.auth import (
    hash_password,
    verify_password
)
from backend.jwt_handler import (
    create_access_token,
    verify_token
)
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from backend.jwt_handler import verify_token


class FolderCreate(BaseModel):
    name: str
    path: str = ""  # relative path of the PARENT folder ("" = storage root)
class RegisterRequest(BaseModel):
    username: str
    password: str
class LoginRequest(BaseModel):
    username: str
    password: str

app = FastAPI(
    title="NAS Server3",
    description="A simple NAS server built with FastAPI",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # NOTE: must be False when allow_origins is "*"
    allow_methods=["*"],
    allow_headers=["*"],
)
security = HTTPBearer()

# Use an absolute path based on this file's location, so storage always
# lands in the same place regardless of where uvicorn is launched from.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_PATH = os.path.join(BASE_DIR, "storage")
USERS_STORAGE = os.path.join(STORAGE_PATH, "users")

os.makedirs(STORAGE_PATH, exist_ok=True)
os.makedirs(USERS_STORAGE, exist_ok=True)


def safe_path(relative_path: str) -> str:
    """
    Convert a relative path coming from the client into a safe absolute
    path inside STORAGE_PATH. Raises 400 if the resulting path would
    escape STORAGE_PATH (e.g. via '..' segments).
    """
    relative_path = (relative_path or "").strip("/")
    full_path = os.path.normpath(os.path.join(STORAGE_PATH, relative_path))

    if not (full_path == STORAGE_PATH or full_path.startswith(STORAGE_PATH + os.sep)):
        raise HTTPException(status_code=400, detail="Invalid path")

    return full_path


def list_dir(rel_path: str):
    full = safe_path(rel_path)

    if not os.path.isdir(full):
        raise HTTPException(status_code=404, detail="Folder not found")

    folders, files = [], []

    for item in os.listdir(full):
        item_path = os.path.join(full, item)
        if os.path.isdir(item_path):
            folders.append(item)
        else:
            files.append(item)

    return {
        "path": rel_path.strip("/"),
        "folders": sorted(folders),
        "files": sorted(files),
    }

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:
        payload = verify_token(token)

        username = payload.get("username")

        if not username:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return username

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


@app.get("/")
def root():
    return {"status": "running", "service": "NAS Server3"}


@app.get("/explorer")
def explorer():
    """List the contents of the storage root."""
    return list_dir("")


@app.get("/folder/{path:path}")
def get_folder(path: str):
    """List the contents of any folder, at any nesting depth."""
    return list_dir(path)


@app.post("/folder")
def create_folder(folder: FolderCreate):
    parent = safe_path(folder.path)

    if not os.path.isdir(parent):
        raise HTTPException(status_code=404, detail="Parent folder not found")

    if not folder.name or "/" in folder.name or "\\" in folder.name:
        raise HTTPException(status_code=400, detail="Invalid folder name")

    new_folder = os.path.join(parent, folder.name)

    if os.path.exists(new_folder):
        raise HTTPException(status_code=400, detail="Folder already exists")

    os.makedirs(new_folder)

    return {"message": f"Folder '{folder.name}' created"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...), path: str = Form("")):
    """Upload a file into the given folder path ("" = storage root)."""
    folder = safe_path(path)

    if not os.path.isdir(folder):
        raise HTTPException(status_code=404, detail="Folder not found")

    file_path = os.path.join(folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "File uploaded", "filename": file.filename}


@app.get("/download/{path:path}")
def download_file(path: str):
    """Download a file at any nesting depth."""
    full = safe_path(path)

    if not os.path.isfile(full):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(path=full, filename=os.path.basename(full))


@app.delete("/delete/{path:path}")
def delete_item(path: str):
    """Delete a file, or recursively delete a folder, at any nesting depth."""
    full = safe_path(path)

    if full == STORAGE_PATH:
        raise HTTPException(status_code=400, detail="Cannot delete the storage root")

    if os.path.isdir(full):
        shutil.rmtree(full)
        return {"message": "Folder deleted"}

    if os.path.isfile(full):
        os.remove(full)
        return {"message": "File deleted"}

    raise HTTPException(status_code=404, detail="Not found")



@app.get("/me")
def me(
    current_user: str = Depends(get_current_user)
):
    return {
        "username": current_user
    }

@app.post("/register")
def register(data: RegisterRequest):

    users_file = os.path.join(
        BASE_DIR,
        "users.json"
    )

    with open(users_file, "r") as f:
        users = json.load(f)

    if data.username in users:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    password_hash = hash_password(
        data.password
    )

    users[data.username] = {
        "password_hash": password_hash,
        "role": "user"
    }

    with open(users_file, "w") as f:
        json.dump(
            users,
            f,
            indent=4
        )

    user_folder = os.path.join(
        USERS_STORAGE,
        data.username
    )

    os.makedirs(
        user_folder,
        exist_ok=True
    )

    return {
        "message": "User created",
        "username": data.username
    }

@app.post("/login")
def login(data: LoginRequest):

    users_file = os.path.join(
        BASE_DIR,
        "users.json"
    )

    with open(users_file, "r") as f:
        users = json.load(f)

    user = users.get(data.username)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        data.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token({
    "username": data.username
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": data.username
    }