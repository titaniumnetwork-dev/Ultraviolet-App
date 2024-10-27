name: Build and Push to Docker Hub

on:
  push:
    branches: [main]
  schedule:
    - cron: "30 12 * * 0" # Run once every Sunday

jobs:
  build_and_push_docker_images:
    runs-on: ubuntu-latest
    steps:
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERUSERNAME }}
          password: ${{ secrets.DOCKERPASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ secrets.DOCKERUSERNAME }}/ultraviolet-node:latest
