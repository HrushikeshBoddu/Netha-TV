import pytest
from fastapi.testclient import TestClient
from app.main import app  # Import your FastAPI app

client = TestClient(app)  # Initialize the client

# Test case for creating an event
def test_create_event():
    response = client.post(
        "/events/",
        json={
            "title": "Test Event",
            "description": "This is a test event",
            "scheduled_time": "2025-06-01T12:00:00"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Event"
    assert data["description"] == "This is a test event"
    assert data["scheduled_time"] == "2025-06-01T12:00:00"

# Test case for fetching all events
def test_get_all_events(client):
    # First create a test event
    client.post(
        "/events/",
        json={
            "title": "Test Event 1",
            "description": "This is the first test event",
            "scheduled_time": "2025-06-01T14:00:00"
        }
    )
    
    # Fetch all events
    response = client.get("/events/")
    assert response.status_code == 200
    data = response.json()

    # Print out the events for debugging
    print("Received events data:", data)
    
    # Check if the data contains the event with the correct title
    assert len(data) > 0
    assert data[0]["title"] == "Test Event 1", f"Expected 'Test Event 1' but got {data[0]['title']}"

# Test case for fetching a specific event by ID
def test_get_event_by_id():
    # First create a test event
    create_response = client.post(
        "/events/",
        json={
            "title": "Test Event 2",
            "description": "This is the second test event",
            "scheduled_time": "2025-06-01T16:00:00"
        }
    )
    event_id = create_response.json()["id"]
    
    response = client.get(f"/events/{event_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == event_id
    assert data["title"] == "Test Event 2"
    assert data["description"] == "This is the second test event"
    assert data["scheduled_time"] == "2025-06-01T16:00:00"

# Test case for fetching an event that does not exist
def test_get_event_not_found():
    response = client.get("/events/999")  # Assuming 999 is a non-existent event ID
    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found"
