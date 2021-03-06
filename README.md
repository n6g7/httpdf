# htt*pdf*
[![CircleCI](https://circleci.com/gh/n6g7/httpdf.svg?style=svg)](https://circleci.com/gh/n6g7/httpdf)
[![Docker Hub](https://badgen.net/docker/pulls/n6g7/httpdf)](https://hub.docker.com/r/n6g7/httpdf/)

A small HTTP microservice to generate PDFs.

[react-pdf](https://react-pdf.org/) + [Express](https://expressjs.com/) + [Docker](https://www.docker.com/)

## Getting started

- Extend the [`n6g7/httpdf` image](https://hub.docker.com/r/n6g7/httpdf/) and copy your own PDF documents source:
  ```Dockerfile
  FROM n6g7/httpdf:latest
  COPY ./documents $HTTPDF_DOCUMENTS_SRC
  RUN yarn prebuild
  ```
- Build and run:
  ```sh
  docker build . -t my_httpf
  docker run my_httpf -p 8000:80
  ```
- Generate pdf with HTTP requests:
  ```sh
  http localhost:8000/doc?a=Hello&b=World > doc.pdf
  http POST localhost:8000/doc a=Hello b=World > doc.pdf #equivalent
  ```

See the [example directory](./example) for a full example with docker-compose.

## Features

### Props

Query parameters and body data sent with the request are passed to the react components as props.

They are validated using [prop-types](https://github.com/facebook/prop-types) and, if there are any, errors are returned with a 400 HTTP response.

```sh
$ http "localhost:8000/demo?a=a" -p hb
HTTP/1.1 400 Bad Request
Connection: keep-alive
Content-Disposition: attachment; filename="demo.pdf"
Content-Length: 90
Content-Type: application/json; charset=utf-8
Date: Sun, 04 Nov 2018 00:31:23 GMT

{
    "errors": [
        "The prop `b` is marked as required in `Test`, but its value is `undefined`."
    ]
}
```

### Custom filename

By default, the suggested filename of the generated pdf will be computed from the component's file name (`doc.js` -> `doc.pdf`).
If you would like to receive a different filename, you can override it with the `filename` query parameter:
```sh
$ http "localhost:8000/demo?filename=custom.pdf" -p h
HTTP/1.1 200 OK
Connection: keep-alive
Content-Disposition: attachment; filename="custom.pdf"
Content-Type: application/pdf
Date: Sun, 04 Nov 2018 00:29:58 GMT
Transfer-Encoding: chunked
```

### Watch mode

Use the `HTTPDF_WATCH` environment variable while developing to watch and automatically reload files as you make changes:
```Dockerfile
FROM n6g7/httpdf:latest
ENV HTTPDF_WATCH 1
COPY ./documents $HTTPDF_DOCUMENTS_SRC
RUN yarn prebuild
```

### Images

Copy your image files anywhere on the docker image and you can use the react-pdf API to render images:
```js
import { Image, View } from "@react-pdf/renderer"

const Component = ({ path, ...props }) =>
  <View {...props}>
    <Image src={`/images/${path}`} />
  </View>
```

See [react-pdf docs](https://react-pdf.org/components#image) for the list of available props.

### Custom fonts

Copy your font files anywhere on the docker image and you can use the react-pdf API to use custom fonts:
```js
import { Font, StyleSheet } from "@react-pdf/renderer"

Font.register("/fonts/montserrat.ttf", {
  family: "Montserrat",
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Montserrat",
    backgroundColor: "#E4E4E4",
  },
})
```

Browse the [test files](./__tests__/app.js) for a description of all the features.

### Async props

Perform asynchronous actions before rendering in the `getAsyncProps` static method:

```js
export default class AsyncPropsTest extends PureComponent {
  static document = true

  static async getAsyncProps(props) {
    return {
      result: await someAPIcall(),
    }
  }

  render() {
    return (
      <Document>
        <Page size="A4">
          <Text>{this.props.result}</Text>
        </Page>
      </Document>
    )
  }
}
```

## Contributing

- Release: `yarn version && make release`
