#!/bin/bash
# Set this to 1 to automatically attempt a fix when an error occurs while running npm start.
fix=0

npm start || [[ $fix = 1 ]] && npm install && npm start