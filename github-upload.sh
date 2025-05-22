#!/bin/bash

# GitHub upload script for MusicLite
# This script will automatically commit and push changes to GitHub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting GitHub upload for MusicLite...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: Git is not installed. Please install git first.${NC}"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    
    # Check if initialization was successful
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to initialize git repository.${NC}"
        exit 1
    fi
fi

# Check if remote origin exists
if ! git remote | grep -q "origin"; then
    echo -e "${YELLOW}Adding remote origin...${NC}"
    git remote add origin https://github.com/LordaDark/MusicLite.git
    
    # Check if adding remote was successful
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to add remote origin.${NC}"
        exit 1
    fi
fi

# Create README.md if it doesn't exist
if [ ! -f README.md ]; then
    echo -e "${YELLOW}Creating README.md...${NC}"
    echo "# MusicLite" > README.md
    echo "A lightweight music player app built with React Native and Expo." >> README.md
fi

# Add all files to git
echo -e "${YELLOW}Adding files to git...${NC}"
git add .

# Commit changes
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "Update: $(date)"

# Check if commit was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to commit changes. You might need to configure git with your name and email.${NC}"
    echo -e "${YELLOW}Try running:${NC}"
    echo "git config --global user.name \"Your Name\""
    echo "git config --global user.email \"your.email@example.com\""
    exit 1
fi

# Set branch to main
echo -e "${YELLOW}Setting branch to main...${NC}"
git branch -M main

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main

# Check if push was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully pushed to GitHub!${NC}"
    echo -e "${GREEN}Your code is now available at: https://github.com/LordaDark/MusicLite${NC}"
else
    echo -e "${RED}Failed to push to GitHub.${NC}"
    echo -e "${YELLOW}You might need to authenticate with GitHub. Try:${NC}"
    echo "1. Create a personal access token on GitHub (Settings > Developer settings > Personal access tokens)"
    echo "2. Use that token as your password when prompted"
    exit 1
fi

exit 0