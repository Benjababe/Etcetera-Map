#!/bin/bash

rm -rf ./backend/build
cd frontend && npm run build;
mv build ../backend/