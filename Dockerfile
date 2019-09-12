FROM node:12-alpine
ENV DEBUG httpdf:*
ENV HTTPDF_DOCUMENTS_SRC /documents
ENV HTTPDF_DOCUMENTS_DIST /code/build/documents
ENV PORT 80
WORKDIR /code

COPY package.json /code
COPY yarn.lock /code
RUN yarn install --production --frozen-lockfile && yarn cache clean
COPY . /code
RUN yarn build:app

EXPOSE $PORT

CMD yarn start
