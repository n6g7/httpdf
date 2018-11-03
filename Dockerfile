FROM node:10
ENV DEBUG httpdf:*
ENV HTTPDF_DOCUMENTS_SRC /documents
ENV HTTPDF_DOCUMENTS_DIST /code/build/documents
WORKDIR /code

COPY package.json /code
COPY yarn.lock /code
RUN yarn install
COPY . /code
RUN yarn build

EXPOSE 8000

CMD yarn start
