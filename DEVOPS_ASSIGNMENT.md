# 🚀 DevOps CI/CD Pipeline — Jewelry Online Store
### COMSATS University Islamabad | DevOps Assignment
**Submitted by:** Zuha Naveed  
**GitHub Repository:** [ZuhaNaveed/jewelry-store](https://github.com/ZuhaNaveed/jewelry-store)

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Live Access Links](#live-access-links)
3. [Infrastructure Overview](#infrastructure-overview)
4. [Pipeline Architecture](#pipeline-architecture)
5. [CI/CD Pipeline Stages](#cicd-pipeline-stages)
6. [Selenium Test Suite — 18 Test Cases](#selenium-test-suite)
7. [Key Commands Reference](#key-commands-reference)
8. [Technologies Used](#technologies-used)
9. [Assignment Results](#assignment-results)

---

## 🌐 Project Overview

This project demonstrates a complete **CI/CD DevOps pipeline** for a **Next.js + MongoDB Jewelry Store** web application, deployed on **AWS EC2**, automated through **Jenkins**, containerized via **Docker**, and tested with **Selenium WebDriver**.

Every `git push` to the `main` branch automatically:
1. Triggers Jenkins via GitHub webhook
2. Builds and deploys Docker containers
3. Runs 18 Selenium automated tests
4. Sends an email notification with test results

---

## 🔗 Live Access Links

| Service | URL | Credentials |
|---------|-----|-------------|
| **Jenkins Dashboard** | [http://13.60.249.132:8080](http://13.60.249.132:8080) | `admin` / `zohaassignment.1234` |
| **Jewelry Store App** | [http://13.60.249.132:3001](http://13.60.249.132:3001) | *(public)* |
| **Jenkins Pipeline** | [http://13.60.249.132:8080/job/jewelry-store-pipeline/](http://13.60.249.132:8080/job/jewelry-store-pipeline/) | — |
| **GitHub Repository** | [https://github.com/ZuhaNaveed/jewelry-store](https://github.com/ZuhaNaveed/jewelry-store) | — |

---

## 🏗️ Infrastructure Overview

```
┌─────────────────────────────────────────────────────────┐
│              AWS EC2 (Ubuntu, t3.micro)                  │
│              IP: 13.60.249.132                           │
│                                                         │
│  ┌─────────────────┐    ┌──────────────────────────┐   │
│  │  Jenkins :8080  │    │  Docker Containers        │   │
│  │                 │    │  ┌────────────────────┐   │   │
│  │  - Manages CI   │───▶│  │  jewelry-app :3001 │   │   │
│  │  - Runs tests   │    │  │  (Next.js app)     │   │   │
│  │  - Sends email  │    │  └────────────────────┘   │   │
│  └─────────────────┘    │  ┌────────────────────┐   │   │
│                         │  │  mongodb :27018     │   │   │
│  ┌─────────────────┐    │  │  (database)        │   │   │
│  │  markhobson/    │    │  └────────────────────┘   │   │
│  │  maven-chrome   │    └──────────────────────────┘   │
│  │  (Selenium)     │                                   │
│  └─────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
         ▲
         │ Webhook trigger on git push
         │
┌────────┴────────┐
│  GitHub Repo    │
│  main branch    │
└─────────────────┘
         ▲
         │ git push
         │
┌────────┴────────┐
│  Developer PC   │
│  (VS Code)      │
└─────────────────┘
```

---

## 🔄 Pipeline Architecture

```
Git Push to GitHub
       │
       ▼ (webhook)
┌──────────────┐
│   CHECKOUT   │  • Clones repo from GitHub
│              │  • Captures push author email
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    BUILD     │  • docker compose -f docker-compose.jenkins.yml up -d --build
│              │  • Pulls MongoDB 7 image
│              │  • Builds Next.js Docker image (node:20-slim)
│              │  • Starts jewelry-app (port 3001) and mongodb (port 27018)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    VERIFY    │  • curl -f http://localhost:3001
│              │  • Confirms app returns HTTP 200
│              │  • Checks both containers are running
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     TEST     │  • Runs inside markhobson/maven-chrome:jdk-17 Docker container
│              │  • mvn clean test -DAPP_URL=http://localhost:3001
│              │  • Executes 18 Selenium WebDriver test cases
│              │  • Generates JUnit XML reports
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  POST ACTION │  • Sends email to push author (Gmail SMTP)
│  (always)    │  • Includes build status (SUCCESS/FAILURE)
│              │  • Cleans up containers: docker compose down
└──────────────┘
```

### Key Pipeline Files

| File | Purpose |
|------|---------|
| `Jenkinsfile` | Declarative pipeline definition (5 stages) |
| `docker-compose.jenkins.yml` | Jenkins-specific Docker configuration |
| `Dockerfile` | Multi-stage Next.js production build |
| `selenium-tests/pom.xml` | Maven config for Selenium + JUnit 5 |
| `selenium-tests/src/.../JewelryStoreTest.java` | 18 automated test cases |

---

## ⚙️ CI/CD Pipeline Stages

### Stage 1: Checkout
```groovy
stage('Checkout') {
    git url: 'https://github.com/ZuhaNaveed/jewelry-store.git', branch: 'main'
    // Capture push author email for notification
    env.PUSHER_EMAIL = sh(script: 'git log -1 --format=%ae', returnStdout: true).trim()
}
```

### Stage 2: Build
```groovy
stage('Build') {
    sh 'docker compose -f docker-compose.jenkins.yml down'
    sh 'docker compose -f docker-compose.jenkins.yml up -d --build'
    sh 'sleep 25'  // wait for app startup
}
```

### Stage 3: Verify
```groovy
stage('Verify') {
    sh 'docker ps'
    sh 'curl -f http://localhost:3001'
}
```

### Stage 4: Test
```groovy
stage('Test') {
    docker.image('markhobson/maven-chrome:jdk-17').inside('--network host -u root') {
        sh 'cd selenium-tests && mvn clean test -DAPP_URL=http://localhost:3001 -B'
    }
    junit 'selenium-tests/target/surefire-reports/*.xml'
}
```

### Post Actions (Always)
```groovy
post {
    always {
        emailext(subject: "Jenkins [${status}] - ${JOB_NAME} #${BUILD_NUMBER}", ...)
        sh 'docker compose -f docker-compose.jenkins.yml down'
    }
}
```

---

## 🧪 Selenium Test Suite

**Total: 18 Test Cases | Framework: JUnit 5 + Selenium 4.18 | Browser: Headless Chrome**

### Test Configuration
```java
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless=new");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--disable-gpu");
options.addArguments("--window-size=1920,1080");
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
```

### Complete Test Descriptions

| # | Test ID | Method | Page | What It Tests |
|---|---------|--------|------|---------------|
| 1 | TC01 | `testHomepageLoads` | `/` | Verifies the homepage loads and contains "Jewelry" content in the page source |
| 2 | TC02 | `testHomepageBannerVisible` | `/` | Checks the `#main-banner` section exists and is visible |
| 3 | TC03 | `testHomepageCategoriesVisible` | `/` | Confirms the `#jewelry-categories` grid section is rendered |
| 4 | TC04 | `testHomepageAboutUsVisible` | `/` | Validates the `#about-us` section appears on the homepage |
| 5 | TC05 | `testShopNowNavigation` | `/` → `/shop` | Clicks the "Shop Now" CTA button and verifies URL changes to `/shop` |
| 6 | TC06 | `testShopPageLoads` | `/shop` | Navigates to shop page and verifies product names appear (Bracelet/Necklace/Ring) |
| 7 | TC07 | `testShopPageProductCount` | `/shop` | Counts product images and asserts at least 1 product image is present (found: 12) |
| 8 | TC08 | `testHeaderNavigationPresent` | `/` | Verifies the `<header>` navigation element is displayed |
| 9 | TC09 | `testLoginPageLoads` | `/login` | Checks login page has visible email and password input fields |
| 10 | TC10 | `testLoginPageHasSubmitButton` | `/login` | Verifies submit button exists and has text "Log In" |
| 11 | TC11 | `testLoginWithInvalidCredentials` | `/login` | Submits invalid credentials and asserts an error message appears (red text) |
| 12 | TC12 | `testSignupPageLoads` | `/signup` | Confirms signup page shows username, email, and password fields |
| 13 | TC13 | `testSignupPageHeading` | `/signup` | Validates the `<h1>` heading on signup page reads "Signup" |
| 14 | TC14 | `testCartPageLoads` | `/cart` | Checks cart page loads with a heading containing "Cart" or "Shopping" |
| 15 | TC15 | `testEmptyCartMessage` | `/cart` | Verifies empty cart state shows "empty", "Go to Shop", or "Cart" text |
| 16 | TC16 | `testContactPageLoads` | `/contact` | Confirms contact form has name, email, and message textarea fields |
| 17 | TC17 | `testContactPageHeading` | `/contact` | Checks the `<h1>` heading equals "Contact Us" (case-insensitive) |
| 18 | TC18 | `testFooterVisible` | `/` | Asserts the `<footer>` element is visible on the homepage |

### Test Results Summary
```
Tests run: 18, Failures: 0, Errors: 0, Skipped: 0
Total time: 47.87 seconds
BUILD: SUCCESS
```

---

## 🛠️ Key Commands Reference

### EC2 & SSH
```bash
# Connect to EC2 instance
ssh -i "jewelry-jenkins-key.pem" ubuntu@13.60.249.132

# Check system resources
free -h
df -h
```

### Jenkins Setup
```bash
# Install Java 21
sudo apt install -y openjdk-21-jdk

# Download Jenkins WAR
wget https://get.jenkins.io/war-stable/latest/jenkins.war

# Run Jenkins as a service
sudo systemctl start jenkins
sudo systemctl status jenkins

# Add 2GB swap space (prevents OOM on t3.micro)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Fix Jenkins temp directory (redirect to main disk)
sudo sed -i 's|-Djava.awt.headless=true|-Djava.awt.headless=true -Djava.io.tmpdir=/var/jenkins-tmp|g' \
    /etc/systemd/system/jenkins.service

# Increase heartbeat check interval (prevent pipeline timeouts)
# -Dorg.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_CHECK_INTERVAL=86400
```

### Docker Setup
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo chmod 666 /var/run/docker.sock

# Pre-pull images to speed up first build
sudo docker pull mongo:7
sudo docker pull markhobson/maven-chrome:jdk-17

# Pre-build app image
sudo -u jenkins docker compose -f docker-compose.jenkins.yml build

# Clean up dangling images/containers
sudo docker system prune -f
sudo docker volume prune -f
```

### Docker Compose (Jenkins Build)
```bash
# Stop any previous containers
docker compose -f docker-compose.jenkins.yml down

# Build and start containers in detached mode
docker compose -f docker-compose.jenkins.yml up -d --build

# Check running containers
docker ps

# View app logs
docker logs jewelry-app-jenkins
```

### Selenium Tests (Maven)
```bash
# Run Selenium tests locally
mvn clean test -DAPP_URL=http://localhost:3001 -B

# Run with verbose debug output
mvn clean test -DAPP_URL=http://localhost:3001 -e -X
```

### GitHub
```bash
# Push changes
git add .
git commit -m "Your commit message"
git push origin main

# Webhook URL for GitHub (add in repo Settings → Webhooks)
# http://13.60.249.132:8080/github-webhook/
```

### SMTP Gmail Configuration
```
SMTP Server:   smtp.gmail.com
SMTP Port:     587
Security:      STARTTLS
From:          zuhanaveed32@gmail.com
Auth:          Gmail App Password (16-char)
```

---

## 🔧 Technologies Used

| Category | Technology | Version |
|----------|------------|---------|
| **Web App** | Next.js | 14 |
| **Database** | MongoDB | 7 |
| **Runtime** | Node.js | 20-slim |
| **CI/CD Server** | Jenkins | 2.555.1 |
| **Containerization** | Docker + Docker Compose | Latest |
| **Cloud** | AWS EC2 (Ubuntu) | t3.micro |
| **Test Framework** | JUnit | 5.10.2 |
| **Browser Automation** | Selenium WebDriver | 4.18.1 |
| **Test Runner** | Maven Surefire | 3.2.5 |
| **Test Browser** | Chrome (Headless) | 147 |
| **Java** | OpenJDK | 17 (tests), 21 (Jenkins) |
| **Email** | Gmail SMTP via jakarta-mail | — |
| **Notification Plugin** | Email Extension Plugin | — |

---

## ✅ Assignment Results

### Pipeline Execution (Build #5)
```
Started by: GitHub push by ZuhaNaveed
Pipeline: jewelry-store-pipeline

Stage          Status     Duration
─────────────────────────────────
Checkout       ✅ PASSED   15 sec
Build          ✅ PASSED   45 sec  (Docker cache hit)
Verify         ✅ PASSED   28 sec  (curl HTTP 200)
Test           ✅ PASSED   2 min   (18/18 tests pass)
Email          ✅ SENT     5 sec   → zuhaaiman243@gmail.com

Total Duration: ~3.5 minutes
Final Status:   SUCCESS ✅
```

### Test Results Detail
```
[INFO] T E S T S
[INFO] Running com.jewelry.JewelryStoreTest
=== Testing app at: http://localhost:3001 ===
TC01 - Page title: (loaded, content verified)
TC07 - Product images found: 12
TC11 - Error message: Invalid email or password
TC14 - Cart heading: Your Shopping Cart

Tests run: 18, Failures: 0, Errors: 0, Skipped: 0
Time elapsed: 47.87 s

BUILD SUCCESS ✅
```

---

## 📁 Project Structure

```
jewelry-store/
├── Jenkinsfile                          # CI/CD pipeline definition
├── Dockerfile                           # Next.js multi-stage Docker build
├── docker-compose.yml                   # Production Docker Compose
├── docker-compose.jenkins.yml           # Jenkins CI Docker Compose
├── setup_jenkins.sh                     # Jenkins installation script
├── setup_docker.sh                      # Docker installation script
├── DEVOPS_ASSIGNMENT.md                 # This documentation
├── app/                                 # Next.js application source
│   ├── page.js                          # Homepage
│   ├── shop/                            # Shop page
│   ├── cart/                            # Cart page
│   ├── contact/                         # Contact page
│   ├── login/                           # Login page
│   └── signup/                          # Signup page
└── selenium-tests/
    ├── pom.xml                          # Maven project config
    └── src/test/java/com/jewelry/
        └── JewelryStoreTest.java        # 18 Selenium test cases
```

---

*This DevOps pipeline was built for the Software Quality Assurance & DevOps course assignment.*  
*Instructor: Qasim Malik | COMSATS University Islamabad*
