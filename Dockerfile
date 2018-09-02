# Build in full image (needs python)
FROM node:10
WORKDIR /code

COPY . /code
RUN yarn install
RUN yarn build:js

# Run in alpine image
FROM node:10-alpine
WORKDIR /code

COPY --from=0 /code /code
CMD yarn start
