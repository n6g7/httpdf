FROM node:10 AS base
WORKDIR /documents

COPY . /documents
RUN yarn install
RUN yarn build
# Re-install only prod dependencies
RUN rm -rf node_modules
RUN yarn install --prod

FROM n6g7/httpdf:latest

ENV HTTPDF_DOCUMENT_ROOT /documents/build

COPY --from=base /documents /documents
