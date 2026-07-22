import os
import subprocess
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import FileResponse

from backend.services.movie_service import build_movie_catalog, get_movie_by_id, serialize_movie

router = APIRouter(prefix="/movies", tags=["movies"])

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_PATH = BASE_DIR / "storage" / "movies"
STORAGE_PATH.mkdir(parents=True, exist_ok=True)
TRANSCODED_PATH = STORAGE_PATH.parent / ".transcoded_movies"
TRANSCODED_PATH.mkdir(parents=True, exist_ok=True)


def prepare_video_path(movie_id: str, video_path: str) -> str:
    source_path = Path(video_path)
    if source_path.suffix.lower() != ".mkv":
        return video_path

    cached_path = TRANSCODED_PATH / f"{movie_id}.mp4"
    if cached_path.exists() and cached_path.stat().st_mtime >= source_path.stat().st_mtime:
        return str(cached_path)

    temp_path = cached_path.with_suffix(".tmp.mp4")
    temp_path.unlink(missing_ok=True)

    command = [
        "ffmpeg",
        "-y",
        "-i",
        str(source_path),
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        str(temp_path),
    ]

    try:
        subprocess.run(command, check=True, capture_output=True, text=True)
        temp_path.replace(cached_path)
    except (OSError, subprocess.CalledProcessError) as exc:
        temp_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="Unable to prepare movie for playback") from exc

    return str(cached_path)


@router.get("")
def list_movies(query: Optional[str] = Query(default=None)):
    return build_movie_catalog(STORAGE_PATH, query=query)


@router.get("/{movie_id}")
def get_movie(movie_id: str):
    movie = get_movie_by_id(STORAGE_PATH, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return serialize_movie(movie)


@router.get("/{movie_id}/stream")
def stream_movie(movie_id: str, request: Request):
    movie = get_movie_by_id(STORAGE_PATH, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    video_path = movie.get("_video_path")
    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video file not found")

    video_path = prepare_video_path(movie_id, video_path)

    ext = Path(video_path).suffix.lower()
    media_type_map = {
        ".mp4": "video/mp4",
        ".m4v": "video/x-m4v",
        ".mov": "video/quicktime",
        ".mkv": "video/x-matroska",
        ".webm": "video/webm",
    }
    media_type = media_type_map.get(ext, "application/octet-stream")

    response = FileResponse(
        path=video_path,
        media_type=media_type,
        filename=os.path.basename(video_path),
    )
    response.headers["Accept-Ranges"] = "bytes"
    response.headers["Cache-Control"] = "no-cache"
    return response


@router.get("/{movie_id}/poster")
def get_poster(movie_id: str):
    movie = get_movie_by_id(STORAGE_PATH, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    poster_path = movie.get("_poster_path")
    if not poster_path or not os.path.exists(poster_path):
        raise HTTPException(status_code=404, detail="Poster not found")

    return FileResponse(path=poster_path, media_type="image/jpeg", filename=os.path.basename(poster_path))


@router.get("/{movie_id}/backdrop")
def get_backdrop(movie_id: str):
    movie = get_movie_by_id(STORAGE_PATH, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    backdrop_path = movie.get("_backdrop_path")
    if not backdrop_path or not os.path.exists(backdrop_path):
        raise HTTPException(status_code=404, detail="Backdrop not found")

    return FileResponse(path=backdrop_path, media_type="image/jpeg", filename=os.path.basename(backdrop_path))
