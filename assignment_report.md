# Cloud Computing Assignment Report
## Containerized Deployment & CI/CD Pipeline

**Student Name:** [Your Name]  
**Student ID:** [Your ID]  
**Course:** Cloud Computing  
**Date:** April 2026

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Part I: Containerized Deployment](#2-part-i-containerized-deployment)
   - [Dockerfile](#21-dockerfile)
   - [Docker Compose File](#22-docker-compose-file)
   - [Deployment Steps on AWS EC2](#23-deployment-steps-on-aws-ec2)
3. [Part II: Jenkins CI/CD Pipeline](#3-part-ii-jenkins-cicd-pipeline)
   - [Docker Compose File (Jenkins)](#31-docker-compose-file-jenkins)
   - [Jenkinsfile](#32-jenkinsfile-pipeline-script)
   - [Jenkins Setup Steps on AWS EC2](#33-jenkins-setup-steps-on-aws-ec2)
4. [URLs and Links](#4-urls-and-links)

---

## 1. Application Overview

**Jewelry Store** is a full-stack e-commerce web application built using the following technologies:

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | React-based web framework (frontend + backend API routes) |
| **MongoDB 7** | NoSQL database for storing users, products, orders, and messages |
| **Mongoose** | MongoDB ODM for schema modeling |
| **JWT + bcryptjs** | Authentication and password hashing |
| **Tailwind CSS 4** | Styling framework |

### Application Features
- User registration and login with JWT authentication
- Product catalog with categories (rings, necklaces, earrings, bracelets)
- Shopping cart functionality
- Order placement and checkout
- Admin panel for managing orders and products
- Contact form for customer messages

### Database Models
- **User** — username, email, password (hashed), role (user/admin)
- **Order** — items, total, customer details, status
- **Message** — name, email, message content from contact form

---

## 2. Part I: Containerized Deployment

### 2.1 Dockerfile

The Dockerfile uses a **multi-stage build** approach to create an optimized production image:

```dockerfile
# ============================
# Stage 1: Install Dependencies
# ============================
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ============================
# Stage 2: Build the Application
# ============================
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================
# Stage 3: Production Runner
# ============================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Explanation:**
- **Stage 1 (deps):** Installs only the npm dependencies using `npm ci` for reproducible builds
- **Stage 2 (builder):** Copies the source code and builds the Next.js production bundle
- **Stage 3 (runner):** Creates a minimal production image with only the built assets, runs as non-root user for security
- **Standalone output:** Next.js `standalone` mode creates a self-contained server that doesn't require `node_modules` at runtime

### 2.2 Docker Compose File

```yaml
services:
  # MongoDB Database Service
  mongo:
    image: mongo:7
    container_name: jewelry-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - jewelry-net

  # Next.js Web Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: yourdockerhubusername/jewelry-store:latest
    container_name: jewelry-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/jewelry-store
      - JWT_SECRET=mySuperSecretKey123!@#
      - ADMIN_EMAIL=admin@jewelry.com
      - ADMIN_PASSWORD=admin123
    depends_on:
      - mongo
    networks:
      - jewelry-net

volumes:
  mongo-data:
    driver: local

networks:
  jewelry-net:
    driver: bridge
```

**Key Points:**
- **Named Volume (`mongo-data`):** Attached to the MongoDB container at `/data/db` to ensure data persists across container restarts and removals
- **Custom Network (`jewelry-net`):** Allows containers to communicate using service names (e.g., `mongo` instead of IP addresses)
- **`depends_on`:** Ensures MongoDB starts before the application container
- **Environment Variables:** The `MONGO_URI` uses the service name `mongo` as hostname, which Docker resolves within the custom network

### 2.3 Deployment Steps on AWS EC2

#### Step 1: Launch an EC2 Instance
1. Log into AWS Console → EC2 → Launch Instance
2. **Name:** `jewelry-store-server`
3. **AMI:** Ubuntu Server 22.04 LTS
4. **Instance Type:** t2.micro (Free Tier eligible)
5. **Key Pair:** Create or select an existing key pair
6. **Security Group:** Allow inbound rules:
   - SSH (Port 22) — My IP
   - HTTP (Port 80) — Anywhere
   - Custom TCP (Port 3000) — Anywhere
7. Click **Launch Instance**

*[Screenshot: EC2 Instance Launch]*

#### Step 2: Connect to EC2 via SSH
```bash
ssh -i "your-key.pem" ubuntu@<EC2-PUBLIC-IP>
```

*[Screenshot: SSH Connection]*

#### Step 3: Install Docker and Docker Compose
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
sudo apt install -y docker-compose-v2

# Verify installation
docker --version
docker compose version

# Log out and back in for group changes to take effect
exit
```
Then reconnect via SSH.

*[Screenshot: Docker Installation]*

#### Step 4: Clone the Repository
```bash
git clone https://github.com/yourgithubusername/jewelry-store.git
cd jewelry-store
```

#### Step 5: Build and Push Docker Image to Docker Hub
```bash
# Login to Docker Hub
docker login

# Build the image
docker build -t yourdockerhubusername/jewelry-store:latest .

# Push to Docker Hub
docker push yourdockerhubusername/jewelry-store:latest
```

*[Screenshot: Docker Hub Push]*

#### Step 6: Launch the Containerized Application
```bash
docker compose up -d
```

*[Screenshot: Docker Compose Up]*

#### Step 7: Verify Deployment
```bash
# Check running containers
docker ps

# Check logs
docker compose logs -f

# Test the application
curl http://localhost:3000
```

Access the application at: `http://<EC2-PUBLIC-IP>:3000`

*[Screenshot: Running Application in Browser]*

---

## 3. Part II: Jenkins CI/CD Pipeline

### 3.1 Docker Compose File (Jenkins)

The Jenkins docker-compose file differs from Part I as per assignment requirements:

```yaml
services:
  # MongoDB Database Service (Jenkins)
  mongo:
    image: mongo:7
    container_name: jewelry-mongo-jenkins
    restart: always
    ports:
      - "27018:27017"
    volumes:
      - mongo-data-jenkins:/data/db
    networks:
      - jewelry-net-jenkins

  # Next.js Application (Jenkins)
  # Uses volume-mounted code instead of Dockerfile
  app:
    image: node:18-alpine
    container_name: jewelry-app-jenkins
    working_dir: /app
    restart: always
    ports:
      - "3001:3000"
    volumes:
      - .:/app
      - node_modules_jenkins:/app/node_modules
    environment:
      - MONGO_URI=mongodb://mongo:27017/jewelry-store
      - JWT_SECRET=mySuperSecretKey123!@#
      - ADMIN_EMAIL=admin@jewelry.com
      - ADMIN_PASSWORD=admin123
      - HOSTNAME=0.0.0.0
    command: sh -c "npm install && npm run build && npm start"
    depends_on:
      - mongo
    networks:
      - jewelry-net-jenkins

volumes:
  mongo-data-jenkins:
    driver: local
  node_modules_jenkins:
    driver: local

networks:
  jewelry-net-jenkins:
    driver: bridge
```

**Differences from Part I:**

| Aspect | Part I | Part II (Jenkins) |
|--------|--------|-------------------|
| App Container Name | `jewelry-app` | `jewelry-app-jenkins` |
| DB Container Name | `jewelry-mongo` | `jewelry-mongo-jenkins` |
| App Port | 3000 | 3001 |
| DB Port | 27017 | 27018 |
| Build Method | Dockerfile (multi-stage) | Volume mount + inline command |
| Code Delivery | COPY in Dockerfile | Volume mount (`.:/app`) |

### 3.2 Jenkinsfile (Pipeline Script)

```groovy
pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'yourdockerhubusername'
        IMAGE_NAME      = 'jewelry-store'
    }

    stages {
        // Stage 1: Checkout Code from GitHub
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/yourgithubusername/jewelry-store.git'
            }
        }

        // Stage 2: Build & Deploy with Docker Compose
        stage('Build') {
            steps {
                sh '''
                    echo "=== Stopping any previous containers ==="
                    docker compose -f docker-compose.jenkins.yml down || true

                    echo "=== Building and starting containers ==="
                    docker compose -f docker-compose.jenkins.yml up -d --build

                    echo "=== Waiting for containers to be healthy ==="
                    sleep 10
                '''
            }
        }

        // Stage 3: Verify Deployment
        stage('Verify') {
            steps {
                sh '''
                    echo "=== Checking running containers ==="
                    docker ps

                    echo "=== Testing application health ==="
                    curl -f http://localhost:3001 || echo "App is still starting..."
                '''
            }
        }
    }

    post {
        failure {
            sh '''
                echo "=== Build failed, cleaning up ==="
                docker compose -f docker-compose.jenkins.yml down || true
            '''
        }
        success {
            echo 'Pipeline executed successfully! Application is running on port 3001.'
        }
    }
}
```

**Pipeline Stages:**
1. **Checkout:** Fetches latest code from GitHub repository
2. **Build:** Tears down any previous deployment and launches new containers using `docker-compose.jenkins.yml`
3. **Verify:** Confirms containers are running and application responds on port 3001
4. **Post Actions:** Cleans up on failure; prints success message on success

### 3.3 Jenkins Setup Steps on AWS EC2

#### Step 1: Install Jenkins on EC2
```bash
# Install Java (required for Jenkins)
sudo apt update
sudo apt install -y fontconfig openjdk-17-jre

# Add Jenkins repository
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install -y jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

*[Screenshot: Jenkins Installation]*

#### Step 2: Configure Security Group
Add inbound rule:
- Custom TCP — Port **8080** — Anywhere (for Jenkins Web UI)
- Custom TCP — Port **3001** — Anywhere (for Jenkins-deployed app)

#### Step 3: Access Jenkins Web UI
1. Open browser: `http://<EC2-PUBLIC-IP>:8080`
2. Enter the initial admin password from Step 1
3. Install **suggested plugins**
4. Create admin user

*[Screenshot: Jenkins Dashboard]*

#### Step 4: Install Required Plugins
Go to **Manage Jenkins → Plugins → Available plugins** and install:
- **Git** (usually pre-installed)
- **Pipeline**
- **Docker Pipeline**

*[Screenshot: Plugin Installation]*

#### Step 5: Add Jenkins User to Docker Group
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

#### Step 6: Create a Pipeline Job
1. Jenkins Dashboard → **New Item**
2. Name: `jewelry-store-pipeline`
3. Select **Pipeline** → OK
4. Under **Build Triggers:** Check **GitHub hook trigger for GITScm polling**
5. Under **Pipeline:**
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/yourgithubusername/jewelry-store.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
6. Click **Save**

*[Screenshot: Pipeline Configuration]*

#### Step 7: Configure GitHub Webhook
1. Go to your GitHub repository → **Settings → Webhooks → Add webhook**
2. **Payload URL:** `http://<EC2-PUBLIC-IP>:8080/github-webhook/`
3. **Content type:** `application/json`
4. **Trigger:** Just the push event
5. Click **Add webhook**

*[Screenshot: GitHub Webhook Configuration]*

#### Step 8: Test the Pipeline
Push a commit to the repository and verify:
1. Jenkins automatically triggers the pipeline
2. All stages pass (Checkout → Build → Verify)
3. Application is accessible at `http://<EC2-PUBLIC-IP>:3001`

*[Screenshot: Successful Pipeline Run]*

#### Step 9: Bring Down Part II Deployment (as required)
```bash
# On the EC2 instance, bring down the Jenkins deployment
cd /var/lib/jenkins/workspace/jewelry-store-pipeline
docker compose -f docker-compose.jenkins.yml down
```

The Part I deployment on port 3000 remains running.  
When the instructor triggers the pipeline via webhook, Jenkins will bring Part II back up on port 3001.

---

## 4. URLs and Links

| Item | URL |
|------|-----|
| Docker Hub Image | `https://hub.docker.com/r/yourdockerhubusername/jewelry-store` |
| GitHub Repository | `https://github.com/yourgithubusername/jewelry-store` |
| Part I (Live App) | `http://<EC2-PUBLIC-IP>:3000` |
| Part II (Jenkins) | `http://<EC2-PUBLIC-IP>:8080` |
| Part II (App) | `http://<EC2-PUBLIC-IP>:3001` (after pipeline trigger) |

---

**Note:** Replace all placeholders (`yourdockerhubusername`, `yourgithubusername`, `<EC2-PUBLIC-IP>`) with actual values.
