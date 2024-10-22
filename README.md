# Online Learning Platform

[![Go](https://github.com/sandbox-science/online-learning-platform/actions/workflows/go.yml/badge.svg?branch=main)](https://github.com/sandbox-science/online-learning-platform/actions/workflows/go.yml)
[![Node.js CI](https://github.com/sandbox-science/online-learning-platform/actions/workflows/node.js.yml/badge.svg)](https://github.com/sandbox-science/online-learning-platform/actions/workflows/node.js.yml)
[![Docker Image CI](https://github.com/sandbox-science/online-learning-platform/actions/workflows/docker-image.yml/badge.svg)](https://github.com/sandbox-science/online-learning-platform/actions/workflows/docker-image.yml)

This project aims to develop an online learning platform that would help educators create courses while providing students with an immersive and interactive learning experience. The platform will have features such as course creation tools, student enrollment processes, progress tracking, and interactive content delivery. The platform will highlight a modular design, ensuring scalability for future expansion and integration with additional features. Additionally, the platform will focus on user engagement strategies, including personalized learning paths, gamification such as learning streaks, and community-building features to increase the overall learning experience.

## Usage Instructions
Make sure to have Docker installed on your machine.

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. Clone the repository.
3. Navigate to the project directory.
4. Run the following command to start the project:
    ```bash
    docker-compose up --build
    ```
5. Access the backend at [http://localhost:4000](http://localhost:4000)
6. Access the frontend at [http://localhost:3000](http://localhost:3000)

In `./backend` root directory, create a `.env` file and add the following:
```
HOST_ADDR   = ":4000"
DB_HOST     = postgres
DB_USER     = postgres
DB_PASSWORD = 1234
DB_PORT     = 5432
DB_NAME     = csudh_dev
```

# API Documentation

This API documentation provides detailed information for our **endpoint**. Each section outlines the **HTTP method**, **endpoint**, a **description** of the operation, and the required **request body**, along with example `curl` commands to demonstrate how to interact with the API (or just use **Postman**).

## 1. Registration API

- **Endpoint**: `POST /register`
- **Description**: Registers a new user.
- **Request Body**:
    ```json
    {
        "username": "dev",
        "email": "dev@csudh.edu",
        "password": "MyPasssword123",
        "confirm_password": "MyPasssword123"
    }
    ```
- **Example**:
    ```bash
    curl -X POST http://localhost:4000/register -H "Content-Type: application/json" -d '{
        "username": "dev",
        "email": "dev@csudh.edu",
        "password": "MyPasssword123",
        "confirm_password": "MyPasssword123"
    }'
    ```

## 2. Login API

- **Endpoint**: `POST /login`
- **Description**: Logs in an existing user.
- **Request Body**:
    ```json
    {
        "email": "dev@csudh.edu",
        "password": "MyPasssword123"
    }
    ```
- **Example**:
    ```bash
    curl -X POST http://localhost:4000/login -H "Content-Type: application/json" -d '{
        "email": "dev@csudh.edu",
        "password": "MyPasssword123"
    }'
    ```

## 3. Delete API

- **Endpoint**: `DELETE /delete`
- **Description**: Deletes a user by `user_id`.
- **Request Body**:
    ```json
    {
        "user_id": "1"
    }
    ```
- **Example**:
    ```bash
    curl -X DELETE http://localhost:4000/delete -H "Content-Type: application/json" -d '{
        "password": "Password1234",
        "user_id": "1"
    }'
    ```

## 3. User API

- **Endpoint**: `GET /user/:user_id`
- **Description**: Get user by `user_id`.
- **Example**:
    ```bash
    curl -X GET http://localhost:4000/user/10
    ```
