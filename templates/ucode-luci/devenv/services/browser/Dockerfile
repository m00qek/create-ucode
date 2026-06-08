ARG NODE_VERSION=22
ARG ALPINE_VERSION=3.21

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

RUN apk add --no-cache chromium nss freetype harfbuzz ttf-freefont ca-certificates

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package.json ./
RUN npm install --quiet

CMD ["./node_modules/.bin/playwright", "test"]
