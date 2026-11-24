# Dockerized Node.js Service

A beginner-to-intermediate DevOps project demonstrating how to containerize a Node.js application using Docker.

## Project Overview

This project contains a Node.js web service with two endpoints:

- `/` — Returns Hello, world!
- `/secret` — Protected using HTTP Basic Authentication.

## Technologies Used

- Node.js
- Express.js
- Docker
- Docker Compose (not currently required)
- Git and GitHub

## Project Features

- Dockerized Node.js application
- Lightweight Alpine-based Docker image
- Non-root container user
- Environment variables using dotenv
- Basic Authentication for protected endpoint
- `.env` excluded from Docker image and Git repository

## Project Repository

https://github.com/Rizwan786-pixel/node-docker-devops

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Rizwan786-pixel/node-docker-devops.git
cd node-docker-devops
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file:

```env
SECRET_MESSAGE=This is my private DevOps project
USERNAME=admin
PASSWORD=replace_with_your_own_password
PORT=3000
```

Replace `replace_with_your_own_password` with your own password. Never upload `.env` to GitHub.

### 4. Run with Docker

Build the image:

```bash
docker build -t node-docker-service .
```

Start the container:

```bash
docker run -d --name node-service --env-file .env -p 3000:3000 node-docker-service
```

## Test Application

Home endpoint:

```bash
curl http://localhost:3000/
```

Expected response:

```text
Hello, world!
```

Protected endpoint:

```bash
curl -u admin http://localhost:3000/secret
```

Enter your password when prompted.

## Security

- `.env` is excluded using `.gitignore`.
- `.env` is excluded from the Docker build using `.dockerignore`.
- Docker container runs as a non-root user.
- Never commit passwords, access tokens, or private keys.

## Author

Rizwan

GitHub: https://github.com/Rizwan786-pixel

