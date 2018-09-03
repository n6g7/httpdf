# Build base image
FROM node:10 AS httpdf
WORKDIR /code

ENV DEBUG httpdf:*
EXPOSE 8000

COPY . /code
RUN yarn install
RUN yarn build:js

CMD yarn start

# Run in alpine image
FROM httpdf
WORKDIR /code

ENV HTTPDF_DOCUMENT_ROOT /code/build/documents
