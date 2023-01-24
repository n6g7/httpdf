import React from "react";
import PropTypes from "prop-types";
import { Page, Document, StyleSheet } from "@react-pdf/renderer";

import Side from "./components/Side.js";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
});

export default function AsyncPropsTest({ a }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Side text={a} />
      </Page>
    </Document>
  );
  // }
}

export const document = true;

export const propTypes = {
  a: PropTypes.string.isRequired,
};

export const getAsyncProps = async function (props) {
  return {
    ...props,
    a: "async value",
  };
};
