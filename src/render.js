import makeDebug from "debug";
import React from "react";
import ReactPDF from "@react-pdf/renderer";

import checkPropTypes from "./checker.js";
import { PropTypesError } from "./exceptions.js";

const debug = makeDebug("httpdf:renderer");

export default async (Component, props, propTypes, getAsyncProps) => {
  if (getAsyncProps && typeof getAsyncProps === "function") {
    const asyncProps = await getAsyncProps(props);
    props = {
      ...props,
      ...asyncProps,
    };
  }

  const propTypesErrors = checkPropTypes(
    propTypes,
    props,
    "prop",
    Component.name,
  );

  if (propTypesErrors.length > 0) {
    debug(
      `Found %o prop type %s`,
      propTypesErrors.length,
      "error" + (propTypesErrors.length > 1 ? "s" : ""),
    );
    throw new PropTypesError(propTypesErrors);
  }

  return ReactPDF.renderToStream(<Component {...props} />);
};
