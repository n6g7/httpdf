FROM n6g7/httpdf:latest

COPY ./documents $HTTPDF_DOCUMENTS_SRC
COPY ./images /images
COPY ./fonts /fonts

RUN yarn prebuild
