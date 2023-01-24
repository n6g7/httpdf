/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Page, Document } from "@react-pdf/renderer";

export default function BrokenTest() {
  return (
    <Document>
      <Page size="A4">
        <Text>Hello</Text>
      </Page>
    </Document>
  );
}

export const document = true;
