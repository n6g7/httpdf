import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Font } from "@react-pdf/core"
import { Document, Page, StyleSheet } from "@react-pdf/renderer"

import Side from "./Side"

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
