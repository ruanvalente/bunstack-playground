#!/bin/bash

echo "Removendo imagem anterior..."
docker rmi bunstack-test 2>/dev/null || true

echo "Buildando imagem..."
docker build -t bunstack-test -f Dockerfile.prod .

echo "Executando container em modo destacado..."
docker run -d -p 4000:4000 bunstack-test

echo "Container iniciado! Acesse http://localhost:4000"
