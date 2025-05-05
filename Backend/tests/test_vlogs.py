import io
import time

def test_create_vlog(client):
    banner_image = io.BytesIO(b"dummy image data")
    response = client.post(
        "/vlogs/",
        files={"banner": ("test.jpg", banner_image, "image/jpeg")},
        data={
            "title": "Test Vlog 1",
            "video_url": "https://youtu.be/testvlog1",
            "description": "This is a test vlog"
        }
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Vlog 1"

    # Give DB time to flush/write
    time.sleep(0.5)

def test_duplicate_vlog(client):
    # Ensure DB had time to commit from previous test
    time.sleep(1)
    banner_image = io.BytesIO(b"dummy image data")
    response = client.post(
        "/vlogs/",
        files={"banner": ("test.jpg", banner_image, "image/jpeg")},
        data={
            "title": "Duplicate Vlog",
            "video_url": "https://youtu.be/testvlog1",  # Same as previous test
            "description": "Should fail"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "This video has already been posted."

def test_get_new_vlogs(client):
    response = client.get("/vlogs/new")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 5

def test_get_all_vlogs(client):
    response = client.get("/vlogs/all")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_delete_from_new(client):
    response = client.get("/vlogs/new")
    if response.json():
        vlog_id = response.json()[0]["id"]
        delete_response = client.delete(f"/vlogs/new/{vlog_id}")
        assert delete_response.status_code == 200
        assert delete_response.json()["message"] == "Vlog removed from new list"
