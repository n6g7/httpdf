FROM httpdf:latest

COPY . /documents
RUN cd /documents && yarn install
RUN cd /documents && yarn build:js

ENV HTTPDF_DOCUMENT_ROOT /documents/build
