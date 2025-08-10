#!/bin/bash

# Start shop-minis dev and automatically send 'i' to launch iOS simulator
(
  sleep 3
  echo "i"
) | npx shop-minis dev