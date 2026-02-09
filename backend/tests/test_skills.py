"""
Tests for skills endpoints
"""

import pytest


def test_create_skill(client, auth_headers):
    """Test creating a skill"""
    response = client.post(
        "/api/skills/",
        headers=auth_headers,
        json={
            "name": "Python",
            "category": "Programming",
            "current_level": 50,
            "target_level": 90,
            "description": "Python programming language"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Python"
    assert data["category"] == "Programming"
    assert data["current_level"] == 50
    assert data["target_level"] == 90


def test_get_skills(client, auth_headers):
    """Test getting all skills"""
    # Create a skill first
    client.post(
        "/api/skills/",
        headers=auth_headers,
        json={
            "name": "JavaScript",
            "category": "Programming",
            "current_level": 60,
            "target_level": 80
        }
    )
    
    response = client.get("/api/skills/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == "JavaScript"


def test_get_skill_by_id(client, auth_headers):
    """Test getting a specific skill"""
    # Create a skill
    create_response = client.post(
        "/api/skills/",
        headers=auth_headers,
        json={
            "name": "React",
            "category": "Frontend",
            "current_level": 40,
            "target_level": 70
        }
    )
    skill_id = create_response.json()["id"]
    
    # Get the skill
    response = client.get(f"/api/skills/{skill_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == skill_id
    assert data["name"] == "React"


def test_update_skill(client, auth_headers):
    """Test updating a skill"""
    # Create a skill
    create_response = client.post(
        "/api/skills/",
        headers=auth_headers,
        json={
            "name": "Docker",
            "category": "DevOps",
            "current_level": 30,
            "target_level": 60
        }
    )
    skill_id = create_response.json()["id"]
    
    # Update the skill
    response = client.put(
        f"/api/skills/{skill_id}",
        headers=auth_headers,
        json={
            "current_level": 45
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["current_level"] == 45


def test_delete_skill(client, auth_headers):
    """Test deleting a skill"""
    # Create a skill
    create_response = client.post(
        "/api/skills/",
        headers=auth_headers,
        json={
            "name": "AWS",
            "category": "Cloud",
            "current_level": 20,
            "target_level": 50
        }
    )
    skill_id = create_response.json()["id"]
    
    # Delete the skill
    response = client.delete(f"/api/skills/{skill_id}", headers=auth_headers)
    assert response.status_code == 200
    
    # Verify it's deleted
    get_response = client.get(f"/api/skills/{skill_id}", headers=auth_headers)
    assert get_response.status_code == 404


def test_create_skill_unauthorized(client):
    """Test creating a skill without authentication"""
    response = client.post(
        "/api/skills/",
        json={
            "name": "Python",
            "category": "Programming",
            "current_level": 50,
            "target_level": 90
        }
    )
    assert response.status_code == 401
