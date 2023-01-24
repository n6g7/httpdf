import React from "react";
import PropTypes from "prop-types";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

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
});

export default function Test({ a, b }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{a}</Text>
        </View>
        <View style={styles.section}>
          <Text>{b}</Text>
        </View>
      </Page>
    </Document>
  );
}

export const document = true;

export const propTypes = {
  a: PropTypes.string.isRequired,
  b: PropTypes.string.isRequired,
};
