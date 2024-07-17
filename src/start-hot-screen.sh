#!/bin/sh

[ ! -d "./node_modules/" ] && bun i
screen -dmS telegram bun --watch telegram.js
