#!/bin/bash
cd /home/kavia/workspace/code-generation/creatorhub-59567-1346ea53/creatorhub_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

