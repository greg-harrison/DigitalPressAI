#!/bin/bash
# Start backend and frontend servers simultaneously
# Usage: ./start.sh

set -e

# Start backend
bun run backend/server.ts &
BACKEND_PID=$!

# Start frontend
bun run frontend/index.ts &
FRONTEND_PID=$!

# Forward termination signals to child processes
trap 'kill $BACKEND_PID $FRONTEND_PID' SIGINT SIGTERM

# Wait for both processes to exit
wait $BACKEND_PID $FRONTEND_PID
