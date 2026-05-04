pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'zuhanaveed'
        IMAGE_NAME      = 'jewelry-store'
        APP_URL         = 'http://localhost:3001'
        GIT_AUTHOR_EMAIL = ''
    }

    stages {
        // ============================
        // Stage 1: Checkout Code from GitHub
        // ============================
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ZuhaNaveed/jewelry-store.git'

                script {
                    // Capture the email of whoever made the push
                    def gitEmail = sh(
                        script: 'git log -1 --format=%ae 2>/dev/null || echo ""',
                        returnStdout: true
                    ).trim()
                    env.PUSHER_EMAIL = gitEmail ? gitEmail : 'zuhanaveed32@gmail.com'
                    echo "=== Push triggered by: ${env.PUSHER_EMAIL} ==="
                }
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

                    echo "=== Waiting for app to be ready ==="
                    sleep 25

                    echo "=== Verifying app is reachable ==="
                    curl -f http://localhost:3001 || echo "App may still be starting..."
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

        // ============================
        // Stage 4: Run Selenium Tests (Headless Chrome in Docker)
        // ============================
        stage('Test') {
            steps {
                script {
                    docker.image('markhobson/maven-chrome:jdk-17').inside('--network host -u root') {
                        sh '''
                            echo "=== Running Selenium Tests ==="
                            cd selenium-tests
                            mvn clean test -DAPP_URL=http://localhost:3001 -B
                        '''
                    }
                }
            }
            post {
                always {
                    // Publish JUnit test results in Jenkins
                    junit allowEmptyResults: true,
                          testResults: 'selenium-tests/target/surefire-reports/*.xml'
                }
            }
        }
    }

    // ============================
    // Post: Email test results to the person who pushed
    // ============================
    post {
        always {
            script {
                def buildStatus = currentBuild.result ?: 'SUCCESS'
                def recipientEmail = env.PUSHER_EMAIL ?: 'zuhanaveed32@gmail.com'

                emailext (
                    subject: "Jenkins [${buildStatus}] - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <html>
                        <body style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="color: ${buildStatus == 'SUCCESS' ? '#28a745' : '#dc3545'};">
                                Build ${buildStatus}
                            </h2>
                            <table style="border-collapse: collapse; width: 100%;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Build #</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Triggered by</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${recipientEmail}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Duration</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${currentBuild.durationString}</td>
                                </tr>
                            </table>
                            <br/>
                            <p>
                                <a href="${env.BUILD_URL}testReport" 
                                   style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">
                                    View Test Report
                                </a>
                                &nbsp;
                                <a href="${env.BUILD_URL}"
                                   style="background:#6c757d;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">
                                    View Build
                                </a>
                            </p>
                            <p style="color:#666;font-size:12px;">
                                Jewelry Store CI/CD Pipeline - COMSATS DevOps Assignment 3
                            </p>
                        </body>
                        </html>
                    """,
                    mimeType: 'text/html',
                    to: recipientEmail,
                    from: 'zuhanaveed32@gmail.com',
                    replyTo: 'zuhanaveed32@gmail.com'
                )
            }
        }
        failure {
            sh '''
                echo "=== Build failed, cleaning up containers ==="
                docker compose -f docker-compose.jenkins.yml down || true
            '''
        }
        success {
            echo 'Pipeline executed successfully! Application is running on port 3001.'
        }
    }
}
