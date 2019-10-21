import React, { PureComponent } from "react"
import { Page, Document } from "@react-pdf/renderer"

export default class BrokenTest extends PureComponent {
  static document = true

  render() {
    // @ts-ignore <Text/> isn't imported
    return (
      <Document>
        <Page size="A4">
          <Text>Hello</Text>
        </Page>
      </Document>
    )
  }
}
