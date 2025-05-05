def test_get_history(client):
    response = client.get("/history/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "id" in data[0]
        assert "title" in data[0]
        assert "type" in data[0]
        assert "created_at" in data[0]
