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

## Documentation
Access the project documentation through the following links:
- [Project Overview](https://github.com/sandbox-science/online-learning-platform/wiki/Home)
- [API Documentation](https://github.com/sandbox-science/online-learning-platform/wiki/API-Doc)


## 1. Update Username API

- **Endpoint**: `PUT /update-username`
- **Description**: Updates the username of a user.

- **Request Body**:
    ```json
    {
        "user_id": "1",
        "token": "your_token_here",
        "username": "newUsername"
    }
    ```

- **Example**:
    ```bash
    curl -X PUT http://localhost:4000/update-username -H "Content-Type: application/json" -d '{
        "user_id": "1",
        "token": "your_token_here",
        "username": "newUsername"
    }'
    ```

 ## 2. Update Email API

- **Endpoint**: `PUT /update-email`
- **Description**: Updates the email address of a user. The `confirm_email` field must match the `email` field for validation.

- **Request Body**:
    ```json
    {
        "user_id": "1",
        "token": "your_token_here",
        "email": "dev@example.com",
        "confirm_email": "dev@example.com"
    }
    ```

- **Example**:
    ```bash
    curl -X PUT http://localhost:4000/update-email -H "Content-Type: application/json" -d '{
        "user_id": "1",
        "token": "your_token_here",
        "email": "dev@example.com",
        "confirm_email": "dev@example.com"
    }'
    ```

## 3. Update Password API

- **Endpoint**: `PUT /update-password`
- **Description**: Updates the password of a user and logs the user out by revoking the current token. The `confirm_password` field must match the `password` field, and a valid `token` is required for authentication.

- **Request Body**:
    ```json
    {
        "user_id": "1",
        "token": "your_token_here",
        "password": "NewPassword123",
        "confirm_password": "NewPassword123"
    }
    ```

- **Example**:
    ```bash
    curl -X PUT http://localhost:4000/update-password -H "Content-Type: application/json" -d '{
        "user_id": "1",
        "token": "your_token_here",
        "password": "NewPassword123",
        "confirm_password": "NewPassword123"
    }'
    ```
