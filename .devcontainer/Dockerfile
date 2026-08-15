FROM node:24-slim
RUN corepack enable
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl gh git \
  && rm -rf /var/lib/apt/lists/*

USER node
