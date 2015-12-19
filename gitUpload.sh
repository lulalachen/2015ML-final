#!/bin/bash -e

if [[ $1 ]]; then
  commit_message="$1"
  git add .
  git commit -m "$commit_message"
  git push origin master
else
  while [ "${commit_message}" == "" ]
  do
    read -p "Please enter your commit message: " commit_message
  done
  git add .
  git commit -m "$commit_message"
  git push origin master
fi

echo "uploaded"