import React from "react";
import PropTypes from "prop-types";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    width: "50%",
  },
});

export default function Side({ children, text }) {
  return (
    <View style={styles.section}>
      <Text>{text}</Text>
      {children}
    </View>
  );
}

export const propTypes = {
  children: PropTypes.node,
  text: PropTypes.string.isRequired,
};
