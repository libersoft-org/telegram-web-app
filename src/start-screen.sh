#!/bin/sh

[ ! -d "./node_modules/" ] && bun i
screen -dmS telegram bash -c '
while true; do
 bun telegram.js || exit 1
done
'
