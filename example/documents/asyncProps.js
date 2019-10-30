import React, { PureComponent } from "react"
import { Page, Document, StyleSheet } from "@react-pdf/renderer"

import { Side } from "./components"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
})

export default class AsyncPropsTest extends PureComponent {
  static document = true

  static async getAsyncProps(props) {
    // Do async calls here ...
    return {
      ...props,
      a: "async value",
    }
  }

  render() {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Side text={this.props.a} />
        </Page>
      </Document>
    )
  }
}
