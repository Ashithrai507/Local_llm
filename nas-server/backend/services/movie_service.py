import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional


def slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value or "movie"


def extract_year(folder_name: str) -> Optional[int]:
    match = re.search(r"\((\d{4})\)", folder_name)
    if match:
        return int(match.group(1))
    return None


def discover_movies(storage_path: Path) -> List[Dict[str, Any]]:
    if not storage_path.exists():
        return []

    movies: List[Dict[str, Any]] = []

    for entry in sorted(storage_path.iterdir()):
        if not entry.is_dir():
            continue

        movie_file = None
        for candidate in ["movie.mp4", "movie.mov", "movie.mkv", "movie.webm"]:
            candidate_path = entry / candidate
            if candidate_path.exists():
                movie_file = candidate_path
                break

        if movie_file is None:
            continue

        metadata_path = entry / "metadata.json"
        metadata: Dict[str, Any] = {}
        if metadata_path.exists():
            with metadata_path.open("r", encoding="utf-8") as fh:
                metadata = json.load(fh)

        title = metadata.get("title") or entry.name
        year = metadata.get("year") or extract_year(entry.name)
        movie_id = metadata.get("id") or slugify(f"{title} {year or ''}".strip())

        poster_path = None
        for candidate in ["poster.jpg", "poster.jpeg", "poster.png", "poster.webp"]:
            candidate_path = entry / candidate
            if candidate_path.exists():
                poster_path = candidate_path
                break

        backdrop_path = None
        for candidate in ["backdrop.jpg", "backdrop.jpeg", "backdrop.png", "backdrop.webp"]:
            candidate_path = entry / candidate
            if candidate_path.exists():
                backdrop_path = candidate_path
                break

        genres = metadata.get("genres") or metadata.get("genre")
        if isinstance(genres, str):
            genres = [genres]
        if not genres:
            genres = ["Drama"]

        movie = {
            "id": movie_id,
            "title": title,
            "year": year,
            "description": metadata.get("description") or f"{title} is ready to stream.",
            "genres": genres,
            "rating": metadata.get("rating", 7.5),
            "runtime": metadata.get("runtime", 120),
            "language": metadata.get("language", "English"),
            "cast": metadata.get("cast", []),
            "tags": metadata.get("tags", []),
            "continue_watching": bool(metadata.get("continue_watching", False)),
            "recently_added": bool(metadata.get("recently_added", False)),
            "featured": bool(metadata.get("featured", False)),
            "category": metadata.get("category") or genres[0],
            "source_file": str(movie_file.name),
            "_video_path": str(movie_file),
            "_poster_path": str(poster_path) if poster_path else None,
            "_backdrop_path": str(backdrop_path) if backdrop_path else None,
        }
        movies.append(movie)

    return movies


def serialize_movie(movie: Dict[str, Any]) -> Dict[str, Any]:
    payload = {key: value for key, value in movie.items() if not key.startswith("_")}
    payload["video"] = f"/movies/{movie['id']}/stream"
    payload["poster"] = f"/movies/{movie['id']}/poster"
    payload["backdrop"] = f"/movies/{movie['id']}/backdrop"
    return payload


def build_movie_catalog(storage_path: Path, query: Optional[str] = None) -> Dict[str, Any]:
    movies = discover_movies(storage_path)

    if query:
        q = query.lower()
        movies = [
            movie for movie in movies
            if q in movie["title"].lower()
            or q in " ".join(movie["genres"]).lower()
            or q in " ".join(movie.get("tags", [])).lower()
        ]

    serialized = [serialize_movie(movie) for movie in movies]

    continue_watching = [movie for movie in serialized if movie["continue_watching"]]
    recently_added = [movie for movie in serialized if movie["recently_added"]]

    genres: Dict[str, List[Dict[str, Any]]] = {}
    for movie in serialized:
        for genre in movie["genres"]:
            genres.setdefault(genre, []).append(movie)

    return {
        "movies": serialized,
        "continue_watching": continue_watching,
        "recently_added": recently_added,
        "genres": genres,
    }


def get_movie_by_id(storage_path: Path, movie_id: str) -> Optional[Dict[str, Any]]:
    for movie in discover_movies(storage_path):
        if movie["id"] == movie_id:
            return movie
    return None
