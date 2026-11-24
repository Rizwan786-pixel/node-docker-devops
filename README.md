# Dockerized Node.js Service — AWS EC2 Deployment with GitHub Actions

A simple Node.js web service containerized with Docker and deployed to a remote AWS EC2 Ubuntu server using GitHub Actions. This project demonstrates Docker, GitHub Container Registry (GHCR), AWS EC2, CI/CD automation, and secrets management.

## Project Overview

The application provides two HTTP endpoints:

- `/` — Returns `Hello, world!`
- `/secret` — Returns a private message after Basic Authentication.

The application is packaged into a Docker image, pushed to GitHub Container Registry, and deployed to an AWS EC2 instance through a GitHub Actions workflow.

## Architecture

```text
Developer
   |
   | Git Push
   v
GitHub Repository
   |
   v
GitHub Actions
   |
   | Build Docker Image
   v
GitHub Container Registry (GHCR)
   |
   | Pull Latest Image
   v
AWS EC2 Ubuntu Server
   |
   v
Docker Container
   |
   v
Nginx Reverse Proxy
   |
   v
Node.js Service
```

## Technologies Used

- Node.js
- Express.js
- Docker
- Dockerfile
- Alpine Linux
- GitHub Actions
- GitHub Container Registry (GHCR)
- AWS EC2
- Ubuntu Linux
- Nginx
- Git and GitHub
- Environment variables and GitHub Secrets

## Project Structure

```text
node-docker-devops/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── app.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env
└── README.md
```

**Note:** The `.env` file is stored locally and on the EC2 server. It must not be committed to GitHub or included in the Docker image.

## Step 1 — Creating the Node.js Service

The application was created using Node.js and Express.js.

Install dependencies:

```bash
npm install express dotenv
```

The service provides two endpoints:

| Endpoint | Description |
|---|---|
| `/` | Returns `Hello, world!` |
| `/secret` | Protected endpoint using Basic Authentication |

### Environment Variables

Create a `.env` file:

```env
SECRET_MESSAGE=Your private message
USERNAME=admin
PASSWORD=your_secure_password
PORT=3000
```

Replace `Your private message` and `your_secure_password` with your own values. Never upload real credentials to GitHub.

Run the application locally:

```bash
node app.js
```

## Step 2 — Dockerizing the Node.js Service

The application is containerized using Docker.

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["node", "app.js"]
```

### Build the Docker Image

```bash
docker build -t node-docker-devops .
```

### Run the Docker Container Locally

```bash
docker run -d \
  --name node-service \
  -p 3000:3000 \
  --env-file .env \
  node-docker-devops
```

Test the application:

```bash
curl http://localhost:3000/
```

Expected response:

```text
Hello, world!
```

## Step 3 — Setting Up the Remote Linux Server

AWS EC2 was used as the remote Linux server.

Server configuration:

- Cloud Provider: AWS
- Service: Amazon EC2
- Operating System: Ubuntu Linux
- Instance Type: t3.micro
- Container Runtime: Docker

### Connect to EC2

```bash
ssh -i ~/.ssh/testkey.pem ubuntu@3.95.65.9
```

Replace `3.95.65.9` with your EC2 public IP address.

### Prepare the Deployment Environment

The application environment file is stored on the server at:

```text
/opt/node-service/.env
```

The file contains the application's environment variables and is kept separate from the Docker image.

The Docker container uses the existing Docker network:

```text
aws-deployment_default
```

Nginx is configured as a reverse proxy so that requests to `/node/` are forwarded to the Node.js service on port 3000.

## Step 4 — Deploying with GitHub Actions

GitHub Actions automates the Docker build, image publishing, and deployment process.

### Docker Image Registry

The Docker image is published to GitHub Container Registry:

```text
ghcr.io/rizwan786-pixel/node-docker-devops:latest
```

### GitHub Actions Workflow

Workflow file:

```text
.github/workflows/deploy.yml
```

The workflow contains two jobs.

**Job 1 — Build and Push**

1. Checks out the GitHub repository.
2. Sets up Docker Buildx.
3. Authenticates with GitHub Container Registry.
4. Builds the Docker image.
5. Pushes the image to GHCR.

**Job 2 — Deploy**

1. Decodes the SSH private key from a GitHub Secret.
2. Connects to the AWS EC2 server using SSH.
3. Pulls the latest Docker image.
4. Removes the previous Node.js container.
5. Starts the updated container using the server-side `.env` file.

### GitHub Secrets Configuration

The following repository secrets are used:

| Secret Name | Purpose |
|---|---|
| `EC2_HOST` | EC2 public IP address |
| `EC2_USER` | EC2 SSH username |
| `EC2_SSH_KEY_B64` | Base64-encoded SSH private key |

The workflow also uses GitHub's automatically provided `GITHUB_TOKEN` to authenticate with GHCR.

Never put private keys, passwords, or tokens directly in the workflow file.

### Automatic Deployment

Whenever code is pushed to the `main` branch:

```bash
git add .
git commit -m "Update Node.js service"
git push origin main
```

GitHub Actions automatically builds the Docker image, pushes it to GHCR, and deploys it to EC2.

## Application Testing

The deployed application is accessible through the EC2 public IP and Nginx reverse proxy.

### Public Endpoint

```text
http://3.95.65.9/node/
```

Expected response:

```text
Hello, world!
```

### Protected Endpoint

```text
http://3.95.65.9/node/secret
```

Test with:

```bash
curl -i -u admin http://3.95.65.9/node/secret
```

Enter the password configured in the server-side `.env` file.

Expected response:

```text
This is my private DevOps project
```

## Security Practices

- Application credentials are stored in environment variables.
- `.env` is excluded from Git using `.gitignore`.
- `.env` is excluded from the Docker build context using `.dockerignore`.
- The Docker container runs as a non-root user.
- SSH credentials are stored in GitHub Secrets.
- The EC2 server uses SSH key authentication.
- SSH access should be restricted to trusted sources. GitHub-hosted runner access must be handled securely for future automated deployments.
- Use HTTPS and a secure authentication mechanism before exposing sensitive applications publicly. Basic Authentication over plain HTTP is suitable only for this demonstration.

## What I Learned

Through this project, I practiced:

- Building a Node.js service with Express.js.
- Creating and optimizing a Dockerfile.
- Building and running Docker containers.
- Using Alpine-based Docker images.
- Running containers with a non-root user.
- Managing application secrets with environment variables.
- Setting up an AWS EC2 Ubuntu server.
- Connecting to a remote Linux server using SSH.
- Publishing Docker images to GHCR.
- Automating Docker builds and deployments with GitHub Actions.
- Configuring Nginx as a reverse proxy.
- Testing deployed HTTP endpoints.

## Project Status

**Completed:** All four project requirements have been implemented and the public and protected endpoints have been tested successfully.

## Repository

GitHub: https://github.com/Rizwan786-pixel/node-docker-devops
## Roadmap.sh Project

Project URL: https://roadmap.sh/projects/dockerized-service-deployment
