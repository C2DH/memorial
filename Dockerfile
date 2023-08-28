FROM node:18-alpine as builder

ARG GIT_TAG
ARG GIT_BRANCH
ARG GIT_REVISION

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY public ./public
COPY src ./src
COPY vite.config.js .
COPY index.html .
COPY .env .

ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096

ENV VITE_GIT_TAG=${GIT_TAG}
ENV VITE_GIT_BRANCH=${GIT_BRANCH}
ENV VITE_GIT_REVISION=${GIT_REVISION}

RUN yarn run build

FROM busybox
WORKDIR /app
COPY --from=builder /app/build ./
