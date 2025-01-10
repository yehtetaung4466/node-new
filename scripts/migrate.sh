#!/bin/bash

# Run drizzle-kit push or migration process with auto response to prompts

# Set the command you want to run (drizzle-kit push or similar)
COMMAND="npm run push"

# Use `yes` to automatically answer "y" to any prompts
yes | $COMMAND
