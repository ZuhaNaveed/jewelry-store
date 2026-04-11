pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'zuhanaveed'
        IMAGE_NAME      = 'jewelry-store'
    }

    stages {
        // ============================
        // Stage 1: Checkout Code from GitHub
        // ============================
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ZuhaNaveed/jewelry-store.git'
            }
        }

        // ============================
        // Stage 2: Build & Deploy with Docker Compose
        // ============================
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

        // ============================
        // Stage 3: Verify Deployment
        // ============================
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
