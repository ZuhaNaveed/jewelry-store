#!/bin/bash
set -e

echo "=============================="
echo "Method: Install Jenkins via WAR (universal)"
echo "=============================="

# Install Java 17 (already done but verify)
java -version

echo "=============================="
echo "Downloading Jenkins WAR directly"
echo "=============================="
sudo mkdir -p /opt/jenkins
sudo wget -O /opt/jenkins/jenkins.war https://get.jenkins.io/war-stable/latest/jenkins.war

echo "=============================="
echo "Creating Jenkins systemd service"
echo "=============================="
# Create jenkins user if not exists
sudo useradd -r -m -U -d /var/lib/jenkins -s /bin/bash jenkins 2>/dev/null || true
sudo usermod -aG docker jenkins

# Create Jenkins home directory
sudo mkdir -p /var/lib/jenkins
sudo chown -R jenkins:jenkins /var/lib/jenkins
sudo chmod 755 /var/lib/jenkins

# Create systemd service file
sudo tee /etc/systemd/system/jenkins.service > /dev/null <<'EOF'
[Unit]
Description=Jenkins Automation Server
After=network.target

[Service]
Type=simple
User=jenkins
Group=jenkins
Environment="JENKINS_HOME=/var/lib/jenkins"
Environment="JENKINS_PORT=8080"
ExecStart=/usr/bin/java -Djava.awt.headless=true -jar /opt/jenkins/jenkins.war --httpPort=8080
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=jenkins

[Install]
WantedBy=multi-user.target
EOF

echo "=============================="
echo "Starting Jenkins Service"
echo "=============================="
sudo systemctl daemon-reload
sudo systemctl enable jenkins
sudo systemctl start jenkins

echo "Waiting 30 seconds for Jenkins to start..."
sleep 30

sudo systemctl status jenkins --no-pager | head -20

echo ""
echo "=============================="
echo "STEP: Fix Docker permissions"
echo "=============================="
sudo chmod 666 /var/run/docker.sock

echo ""
echo "=============================="
echo "JENKINS SETUP COMPLETE!"
echo "=============================="
echo ""
echo "=== Waiting for initial password file to be generated ==="
sleep 15

if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
    echo "=== INITIAL ADMIN PASSWORD (COPY THIS!) ==="
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
else
    echo "Password file not ready yet. Check in 1 minute at:"
    echo "sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
fi

echo ""
echo "=== Open Jenkins at: http://13.60.249.132:8080 ==="
