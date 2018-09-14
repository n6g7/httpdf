FROM node:10
WORKDIR /code

ENV DEBUG httpdf:*
ENV HTTPDF_DOCUMENT_ROOT /documents
EXPOSE 8000

COPY . /code
RUN yarn install
RUN yarn build

CMD yarn start
