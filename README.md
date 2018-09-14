# htt*pdf*
[![CircleCI](https://circleci.com/gh/n6g7/httpdf.svg?style=svg)](https://circleci.com/gh/n6g7/httpdf)
[![Docker Hub](https://badgen.net/docker/pulls/n6g7/httpdf)](https://hub.docker.com/r/n6g7/httpdf/)

A small HTTP microservice to generate PDFs.

[react-pdf](https://react-pdf.org/) + [Koa](https://koajs.com/) + [Docker](https://www.docker.com/)

## Usage

- Pull from [docker hub](https://hub.docker.com/r/n6g7/httpdf/)
- Follow [example](./example)

## To do

- [X] Allow custom generated filenames
- [X] Allow GET requests with query params
- [X] Allow POST/PUT requests with body
- [X] Return validation errors when props don't match

## Contributing

- Release: `yarn version && make release`
