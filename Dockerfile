# Base will install runtime dependencies and configure generics
FROM node:20-slim AS base

LABEL maintainer="Lars Brinker"

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

# Add `tiny` init for signal forwarding
RUN apt-get -qq update > /dev/null && \
    apt-get -qq -y install wget > /dev/null && \
    rm -rf /var/lib/apt/lists
RUN wget -qO /tini https://github.com/krallin/tini/releases/download/v0.18.0/tini-$(dpkg --print-architecture) && \
    chmod +x /tini

####################################################################################################

# Builder will install system dependencies
FROM base AS builder

# Install ffmpeg and other deps
RUN apt-get -qq update > /dev/null && \
    apt-get -qq -y install git g++ make python3.11 tar xz-utils > /dev/null && \
    rm -rf /var/lib/apt/lists
RUN wget -qO /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-$(dpkg --print-architecture)-static.tar.xz && \
    tar -x -C /usr/local/bin --strip-components 1 -f /tmp/ffmpeg.tar.xz --wildcards '*/ffmpeg' && \
    rm /tmp/ffmpeg.tar.xz

####################################################################################################

# Build will compile ts to js
FROM builder AS build

# Copy files
COPY --chown=node:node . /app

COPY prisma /prisma

RUN npm update && npm install && npm install yarn

RUN yarn install --frozen-lockfile

RUN npx prisma migrate dev --name init && npx prisma generate

# Build project
RUN yarn build

####################################################################################################

# release has the bare minimum to run the application
FROM base AS release

COPY --from=build --chown=node:node /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=build --chown=node:node /app .

USER node
ENV NODE_ENV=production
ENTRYPOINT ["/tini", "--"]
CMD ["yarn", "serve"]
