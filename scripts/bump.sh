#!/bin/bash
HASH=$(git rev-parse --short HEAD~1)
npm version patch --no-git-tag-version && git add package*.json && git cm -m":bookmark: Bump for $HASH"