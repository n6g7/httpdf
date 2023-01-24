import React from "react";
import { Page, Document, StyleSheet } from "@react-pdf/renderer";

import { Side } from "./components";

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

export const getAsyncProps = async function (props) {
  return {
    ...props,
    a: "async value",
  };
};
