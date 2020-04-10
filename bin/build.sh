#!/usr/bin/env bash

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
docker build -t scraper:latest ${PROJECT_ROOT}