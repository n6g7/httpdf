import React from "react";
import PropTypes from "prop-types";
import { Page, Document, StyleSheet } from "@react-pdf/renderer";

import { Side } from "./components";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
});

export default function Test({ a, b }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Side text={a} />
        <Side text={b} />
      </Page>
    </Document>
  );
}

export const document = true;

export const propTypes = {
  a: PropTypes.string.isRequired,
  b: PropTypes.string.isRequired,
};
