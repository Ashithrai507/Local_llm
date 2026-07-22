from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_list_movies_returns_catalog():
    response = client.get("/movies")
    assert response.status_code == 200
    payload = response.json()
    assert "movies" in payload
    assert payload["movies"]
    assert any(movie["title"] == "the secret life of walter mitty" for movie in payload["movies"])
    assert payload["continue_watching"]
    assert payload["recently_added"]


def test_get_movie_details():
    response = client.get("/movies/interstellar-2014")
    assert response.status_code == 200
    payload = response.json()
    assert payload["title"] == "Interstellar"
    assert payload["year"] == 2014
