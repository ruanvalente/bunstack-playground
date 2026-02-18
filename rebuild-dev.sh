#!/bin/bash

echo "========================================="
echo "  BunStack Development Docker"
echo "========================================="

IMAGE_NAME="bunstack-dev"
CONTAINER_NAME="bunstack-dev"

echo "Parando container anterior..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "Buildando imagem dev..."
docker build -t $IMAGE_NAME -f Dockerfile.dev .

echo "Iniciando container com volume mount..."
docker run -d \
  -p 4000:4000 \
  -p 5173:5173 \
  -v $(pwd)/apps:/app/apps \
  -v $(pwd)/packages:/app/packages \
  -v $(pwd)/package.json:/app/package.json \
  -v $(pwd)/bun.lock:/app/bun.lock \
  -v $(pwd)/tsconfig.base.json:/app/tsconfig.base.json \
  --name $CONTAINER_NAME \
  $IMAGE_NAME

echo ""
echo "========================================="
echo "  Ambiente de desenvolvimento iniciado!"
echo "========================================="
echo "API:    http://localhost:4000"
echo "Web:    http://localhost:5173"
echo ""
echo "Logs: docker logs -f $CONTAINER_NAME"
echo "Parar: docker stop $CONTAINER_NAME"
echo "========================================="
