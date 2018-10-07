FROM n6g7/httpdf:latest

COPY . /documents
RUN cd /documents && yarn install
RUN cd /documents && yarn build

ENV HTTPDF_DOCUMENT_ROOT /documents/build
