import React from "react";
import PropTypes from "prop-types";
import { Document, Font, Image, Page, StyleSheet } from "@react-pdf/renderer";

import Side from "./Side";

Font.register({
  family: "Montserrat",
  src: "/fonts/montserrat.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Montserrat",
    backgroundColor: "#E4E4E4",
  },
  image: {
    width: "80%",
  },
});

export default function Test({ a, b }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Side text={a}>
          <Image
            src="/images/test.png"
            style={styles.image}
            allowDangerousPaths="/images"
          />
        </Side>
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
