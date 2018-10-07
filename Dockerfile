FROM node:10
ENV DEBUG httpdf:*
ENV HTTPDF_DOCUMENT_ROOT /documents
WORKDIR /code

COPY . /code
RUN yarn install
RUN yarn build

EXPOSE 8000

CMD yarn start
