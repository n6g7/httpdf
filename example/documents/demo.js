import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Document, Font, Image, Page, StyleSheet } from "@react-pdf/renderer"

import Side from "./Side"

Font.register({
  family: "Montserrat",
  src: "/fonts/montserrat.ttf",
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Montserrat",
    backgroundColor: "#E4E4E4",
  },
  image: {
    width: "80%",
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
          <Side text={this.props.a}>
            <Image src="/images/test.png" style={styles.image} allowDangerousPaths="/images" />
          </Side>
          <Side text={this.props.b} />
        </Page>
      </Document>
    )
  }
}
