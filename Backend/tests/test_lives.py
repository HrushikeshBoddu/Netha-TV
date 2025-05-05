import io
from datetime import datetime, timedelta

def test_create_live(client):
    banner_image = io.BytesIO(b"dummy image data")
    future_time = (datetime.now() + timedelta(days=1)).isoformat()

    response = client.post(
        "/lives/",
        files={"banner": ("live.jpg", banner_image, "image/jpeg")},
        data={
            "title": "Test Live",
            "schedule": future_time,
            "description": "This is a test live session"
        }
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Live"

def test_get_lives(client):
    response = client.get("/lives/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
