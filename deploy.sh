#!/bin/bash

# Djerba Houches Deployment Script

echo "Building frontend..."
cd frontend
npm run build

echo "Preparing deployment files..."
# Copy built files to deployment directory
mkdir -p ../deploy
cp -r dist/* ../deploy/

echo "Deployment files ready in /deploy folder"
echo "Push to GitHub:"