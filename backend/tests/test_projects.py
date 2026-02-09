"""
Tests for projects endpoints
"""

import pytest


def test_create_project(client, auth_headers):
    """Test creating a project"""
    response = client.post(
        "/api/projects/",
        headers=auth_headers,
        json={
            "title": "Build Portfolio Website",
            "description": "Create a personal portfolio using Next.js",
            "status": "planning"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Build Portfolio Website"
    assert data["status"] == "planning"


def test_get_projects(client, auth_headers):
    """Test getting all projects"""
    # Create a project first
    client.post(
        "/api/projects/",
        headers=auth_headers,
        json={
            "title": "API Development",
            "description": "Build RESTful API",
            "status": "active"
        }
    )
    
    response = client.get("/api/projects/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_project_by_id(client, auth_headers):
    """Test getting a specific project"""
    # Create a project
    create_response = client.post(
        "/api/projects/",
        headers=auth_headers,
        json={
            "title": "Mobile App",
            "description": "React Native app",
            "status": "active"
        }
    )
    project_id = create_response.json()["id"]
    
    # Get the project
    response = client.get(f"/api/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == project_id
    assert data["title"] == "Mobile App"


def test_update_project(client, auth_headers):
    """Test updating a project"""
    # Create a project
    create_response = client.post(
        "/api/projects/",
        headers=auth_headers,
        json={
            "title": "Data Pipeline",
            "description": "ETL pipeline",
            "status": "planning"
        }
    )
    project_id = create_response.json()["id"]
    
    # Update the project
    response = client.put(
        f"/api/projects/{project_id}",
        headers=auth_headers,
        json={
            "status": "active"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"


def test_delete_project(client, auth_headers):
    """Test deleting a project"""
    # Create a project
    create_response = client.post(
        "/api/projects/",
        headers=auth_headers,
        json={
            "title": "Test Project",
            "status": "planning"
        }
    )
    project_id = create_response.json()["id"]
    
    # Delete the project
    response = client.delete(f"/api/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 200
    
    # Verify it's deleted
    get_response = client.get(f"/api/projects/{project_id}", headers=auth_headers)
    assert get_response.status_code == 404


def test_create_project_unauthorized(client):
    """Test creating a project without authentication"""
    response = client.post(
        "/api/projects/",
        json={
            "title": "Unauthorized Project",
            "status": "planning"
        }
    )
    assert response.status_code == 401
