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


def safe_path(
    username: str,
    relative_path: str
):

    user_root = get_user_storage(
        username
    )

    relative_path = (
        relative_path or ""
    ).strip("/")

    full_path = os.path.normpath(
        os.path.join(
            user_root,
            relative_path
        )
    )

    if not (
        full_path == user_root
        or full_path.startswith(
            user_root + os.sep
        )
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid path"
        )

    return full_path


def list_dir(
    username: str,
    rel_path: str
):

    full = safe_path(
        username,
        rel_path
    )

    if not os.path.isdir(full):
        raise HTTPException(
            status_code=404,
            detail="Folder not found"
        )

    folders = []
    files = []

    for item in os.listdir(full):

        item_path = os.path.join(
            full,
            item
        )

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

    print("\n" + "=" * 50)
    print("TOKEN RECEIVED:")
    print(token)
    print("=" * 50)

    try:
        payload = verify_token(token)

        print("JWT VERIFIED SUCCESSFULLY")
        print("PAYLOAD:")
        print(payload)

        username = payload.get("username")

        if not username:
            print("ERROR: Username missing from token")
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        print("CURRENT USER:", username)

        return username

    except Exception as e:

        print("\nJWT ERROR")
        print("ERROR TYPE:", type(e))
        print("ERROR:", str(e))
        print("=" * 50)

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

def get_user_storage(username: str):

    user_root = os.path.join(
        USERS_STORAGE,
        username
    )

    os.makedirs(
        user_root,
        exist_ok=True
    )

    return user_root





@app.get("/")
def root():
    return {"status": "running", "service": "NAS Server3"}


@app.get("/explorer")
def explorer(
    current_user: str = Depends(
        get_current_user
    )
):
    return list_dir(
        current_user,
        ""
    )

@app.get("/folder/{path:path}")
def get_folder(
    path: str,
    current_user: str = Depends(
        get_current_user
    )
):
    return list_dir(
        current_user,
        path
    )


@app.post("/folder")
def create_folder(
    folder: FolderCreate,
    current_user: str = Depends(get_current_user)
):

    parent = safe_path(
        current_user,
        folder.path
    )

    if not os.path.isdir(parent):
        raise HTTPException(
            status_code=404,
            detail="Parent folder not found"
        )

    if (
        not folder.name
        or "/" in folder.name
        or "\\" in folder.name
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid folder name"
        )

    new_folder = os.path.join(
        parent,
        folder.name
    )

    if os.path.exists(new_folder):
        raise HTTPException(
            status_code=400,
            detail="Folder already exists"
        )

    os.makedirs(new_folder)

    return {
        "message": "Folder created",
        "owner": current_user
    }


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    path: str = Form(""),
    current_user: str = Depends(get_current_user)
):

    folder = safe_path(
        current_user,
        path
    )

    if not os.path.isdir(folder):
        raise HTTPException(
            status_code=404,
            detail="Folder not found"
        )

    file_path = os.path.join(
        folder,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "message": "File uploaded",
        "filename": file.filename,
        "owner": current_user
    }


@app.get("/download/{path:path}")
def download_file(
    path: str,
    current_user: str = Depends(get_current_user)
):

    full = safe_path(
        current_user,
        path
    )

    if not os.path.isfile(full):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    return FileResponse(
        path=full,
        filename=os.path.basename(full)
    )


@app.delete("/delete/{path:path}")
def delete_item(
    path: str,
    current_user: str = Depends(get_current_user)
):

    full = safe_path(
        current_user,
        path
    )

    if full == get_user_storage(current_user):
        raise HTTPException(
            status_code=400,
            detail="Cannot delete home directory"
        )

    if os.path.isdir(full):
        shutil.rmtree(full)
        return {"message": "Folder deleted"}

    if os.path.isfile(full):
        os.remove(full)
        return {"message": "File deleted"}

    raise HTTPException(
        status_code=404,
        detail="Not found"
    )



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