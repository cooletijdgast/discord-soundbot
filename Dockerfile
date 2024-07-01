FROM node:20 AS build
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install && npm install yarn
COPY . .
RUN npx prisma generate
RUN yarn build

FROM node:20-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /app

RUN apt-get -qq update > /dev/null && \
    apt-get -qq -y install git g++ make python3.11 tar xz-utils > /dev/null && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists
RUN wget -qO /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-$(dpkg --print-architecture)-static.tar.xz && \
    tar -x -C /usr/local/bin --strip-components 1 -f /tmp/ffmpeg.tar.xz --wildcards '*/ffmpeg' && \
    rm /tmp/ffmpeg.tar.xz

COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/.env .env
COPY --chown=node:node --from=build /app/package.json .
COPY --chown=node:node --from=build /app/package-lock.json .
COPY --chown=node:node --from=build /app/config ./config
RUN npm install --omit=dev
COPY --chown=node:node --from=build /app/node_modules/.prisma/client  ./node_modules/.prisma/client

ENV NODE_ENV production
CMD ["yarn", "serve"]