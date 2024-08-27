
#!/bin/bash

if [ "$(id -u)" != "0" ]; then
    echo "This script must be run as root"
    exit 1
fi

install_debian() {
    if ! dpkg -s "$1" &> /dev/null; then
        if ! apt install -y "$1"; then
            echo "Failed to install $1 on Debian-based system"
            exit 1
        fi
    fi
}

install_arch() {
    if ! pacman -Qi "$1" &> /dev/null; then
        if ! pacman -S --noconfirm "$1"; then
            echo "Failed to install $1 on Arch-based system"
            exit 1
        fi
    fi
}

install_redhat() {
    if ! rpm -q "$1" &> /dev/null; then
        if ! yum install -y "$1"; then
            echo "Failed to install $1 on RedHat-based system"
            exit 1
        fi
    fi
}

install_packages() {
    installer=$1
    shift
    for package in "$@"; do
        $installer "$package"
    done
}

install_and_start() {
    if [ -f /etc/debian_version ]; then
        if ! apt-get update -o Acquire::AllowInsecureRepositories=true 2>/dev/null; then
            echo "Some repositories failed to update, but continuing..."
        fi
        install_packages install_debian git npm
    elif [ -f /etc/arch-release ]; then
        if ! pacman -Syu --noconfirm; then
            echo "Failed to update package list on Arch-based system"
            exit 1
        fi
        install_packages install_arch git npm
    elif [ -f /etc/redhat-release ]; then
        if ! yum update -y; then
            echo "Failed to update package list on RedHat-based system"
            exit 1
        fi
        install_packages install_redhat git npm
    else
        echo "Unsupported distribution"
        exit 1
    fi

    if ! npm install pm2 -g; then
        echo "Failed to install PM2 globally"
        exit 1
    fi

    if [ ! -d "BBS-Proxy" ]; then
        if ! git clone https://github.com/hirotomoki12345/BBS-Proxy.git; then
            echo "Failed to clone the repository"
            exit 1
        fi
    else
        echo "Directory BBS-Proxy already exists, skipping clone"
    fi

    cd BBS-Proxy || { echo "Failed to change directory to BBS-Proxy"; exit 1; }

    if [ ! -d "node_modules" ]; then
        if ! npm install; then
            echo "Failed to install npm dependencies"
            exit 1
        fi
    else
        echo "Dependencies already installed, skipping npm install"
    fi

    if ! pm2 start npm --name "bbs-proxy" -- start; then
        echo "Failed to start the application with PM2"
        exit 1
    fi

    pm2 save
    sudo pm2 startup
    sudo pm2 save

    echo "BBS-Proxy application started successfully with PM2"
}

delete_application() {
    if pm2 list | grep -q 'bbs-proxy'; then
        pm2 stop bbs-proxy
        pm2 delete bbs-proxy
        echo "PM2 application 'bbs-proxy' stopped and deleted successfully."
    else
        echo "PM2 application 'bbs-proxy' not found."
    fi

    # BBS-Proxyディレクトリを削除
    if [ -d "BBS-Proxy" ]; then
        rm -rf BBS-Proxy
        echo "Application directory BBS-Proxy deleted successfully."
    else
        echo "BBS-Proxy directory not found."
    fi
}


show_logs() {
    if [ -d "BBS-Proxy/logs" ]; then
        cat BBS-Proxy/logs/*
    else
        echo "No logs found."
    fi
}

show_details() {
    echo "BBS-Proxy version: $(git -C BBS-Proxy describe --tags 2>/dev/null || echo 'N/A')"
    echo "Node.js version: $(node -v)"
    echo "npm version: $(npm -v)"
    echo "PM2 version: $(pm2 -v)"
}

youtube() {
    cd BBS-Proxy
    sudo bash ./youtube-downloader.sh
}

show_license() {
    if [ -f "BBS-Proxy/LICENSE" ]; then
        cat BBS-Proxy/LICENSE
    else
        echo "No LICENSE file found."
    fi
}

clear
echo " ____  _               ____              _        "
echo "| __ )| | ___   __ _  | __ )  ___   ___ | | _____ "
echo "|  _ \| |/ _ \ / _\` | |  _ \ / _ \ / _ \| |/ / __|"
echo "| |_) | | (_) | (_| | | |_) | (_) | (_) |   <\__ \\"
echo "|____/|_|\___/ \__, | |____/ \___/ \___/|_|\_\___/"
echo "               |___/                              "

echo "Please select an option:"
echo "1) Start new installation"
echo "2) Delete application"
echo "3) Show logs"
echo "4) Show details"
echo "5) youtube"
echo "6) Exit"

read -rp "Enter your choice [1-6]: " choice

case $choice in
    1)
        install_and_start
        ;;
    2)
        delete_application
        ;;
    3)
        show_logs
        ;;
    4)
        show_details
        ;;
    5)
        youtube
        ;;
    6)
        echo "Exiting."
        exit 0
        ;;
    *)
        echo "Invalid option."
        exit 1
        ;;
esac
