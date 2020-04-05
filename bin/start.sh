#!/usr/bin/env bash
#export DEBUG=*

if [[ $1 == '--ws' ]]; then
    # 1. start chrome in debug mode
    # google-chrome --remote-debugging-port=9222 & # background

    # 2. get the ws endpoint
    # TODO!
    ## debugChromeOut=$(google-chrome --incognito --remote-debugging-port=9222)
    ## browserWSEndpoint=$(echo $debugChromeOut | grep 'ws://')

    # 3. expose that to the service through an ENV var
    export WSEndpoint="$browserWSEndpoint"

fi

# 4. built it
yarn build

# 5. start the node service
node dist/index.js