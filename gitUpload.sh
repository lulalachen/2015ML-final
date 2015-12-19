#!/bin/bash -e

if [[ $1 ]]; then
  commit_message="$1"
  git add .
  git commit -m "$commit_message"
  git push
fi