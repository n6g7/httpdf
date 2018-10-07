FROM n6g7/httpdf:latest
ENV HTTPDF_DOCUMENTS_SRC /documents/documents

COPY . /documents
RUN yarn build:docs
