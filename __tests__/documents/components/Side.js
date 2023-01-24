import React from "react";
import PropTypes from "prop-types";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function Side({ text }) {
  return (
    <View style={styles.section}>
      <Text>{text}</Text>
    </View>
  );
}

export const propTypes = {
  text: PropTypes.string.isRequired,
};
