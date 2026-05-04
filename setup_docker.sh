#!/bin/bash
set -e

echo "=============================="
echo "STEP 1: Adding Docker GPG Key"
echo "=============================="
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "=============================="
echo "STEP 2: Adding Docker Repo"
echo "=============================="
CODENAME=$(. /etc/os-release && echo "$VERSION_CODENAME")
# Ubuntu 26.04 (Resolute) may not have Docker packages yet — fall back to noble (24.04)
echo "Detected codename: $CODENAME"
if [ "$CODENAME" = "resolute" ]; then
    echo "Ubuntu 26.04 detected — using noble (24.04) Docker packages"
    CODENAME="noble"
fi
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${CODENAME} stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "=============================="
echo "STEP 3: Installing Docker"
echo "=============================="
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=============================="
echo "STEP 4: Configuring Docker"
echo "=============================="
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker
sudo docker run hello-world

echo ""
echo "=============================="
echo "DOCKER INSTALLATION COMPLETE!"
echo "=============================="
docker --version
