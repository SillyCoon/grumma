FROM node:24-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl gh git \
  && rm -rf /var/lib/apt/lists/*

USER node
