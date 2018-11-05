import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
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
          <View style={styles.section}>
            <Text>{this.props.a}</Text>
          </View>
          <View style={styles.section}>
            <Text>{this.props.b}</Text>
          </View>
        </Page>
      </Document>
    )
  }
}
