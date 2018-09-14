FROM node:10 AS base
WORKDIR /code

COPY . /code
RUN yarn install
RUN yarn build
# Re-install only prod dependencies
RUN rm -rf node_modules
RUN yarn install --prod

FROM node:10-alpine
WORKDIR /code

ENV DEBUG httpdf:*
ENV HTTPDF_DOCUMENT_ROOT /documents
EXPOSE 8000

COPY --from=base /code /code

CMD yarn start
