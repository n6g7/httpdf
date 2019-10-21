import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Page, Document, StyleSheet } from "@react-pdf/renderer"

import { Side } from "./components"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
})

export default class Test extends PureComponent {
  static document = true
  static propTypes = {
    a: PropTypes.string.isRequired,
    b: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Side text={this.props.a} />
          <Side text={this.props.b} />
        </Page>
      </Document>
    )
  }
}
