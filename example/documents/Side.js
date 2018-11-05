import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

export default class Side extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
  }

  render() {
    return (
      <View style={styles.section}>
        <Text>{this.props.text}</Text>
      </View>
    )
  }
}
