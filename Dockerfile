FROM jrottenberg/ffmpeg:4.4-alpine AS ffmpeg
FROM node:lts-alpine
# ENV LD_LIBRARY_PATH=/usr/local/lib
COPY --from=ffmpeg / /
WORKDIR /usr/src/app
COPY package*.json .
COPY tsconfig.json .
COPY src/ ./src/
RUN npm i
RUN npm run build

ENTRYPOINT [ "node", "dist/index.js" ]