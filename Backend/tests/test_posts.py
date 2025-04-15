import io

def test_create_post(client):
    banner_image = io.BytesIO(b"dummy image data")
    response = client.post(
        "/posts/",
        files={"banner": ("post.jpg", banner_image, "image/jpeg")},
        data={
            "title": "Test Post",
            "content": "This is a test post"
        }
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Post"

def test_get_posts(client):
    response = client.get("/posts/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
