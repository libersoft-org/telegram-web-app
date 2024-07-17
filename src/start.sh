#!/bin/sh

[ ! -d "./node_modules/" ] && bun i
bun telegram.js $1
