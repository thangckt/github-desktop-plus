#!/bin/bash

cd /app

export FORCE_COLOR=true 
yarn test:unit || exit 1
yarn test:eslint || exit 1
yarn test:script || exit 1

echo '-------------------'
echo 'All tests passed 🎉'
echo '-------------------'
