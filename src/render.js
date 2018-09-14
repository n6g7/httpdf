import makeDebug from "debug"
import React from "react"
import ReactPDF from "@react-pdf/node"

import checkPropTypes from "./checker"

const debug = makeDebug("httpdf:renderer")

export default (Component, props) => {
  const propTypesErrors = checkPropTypes(Component.propTypes, props, "prop", Component.name)

  if (propTypesErrors.length > 0) {
    debug(
      `Found %o prop type %s`,
      propTypesErrors.length,
      "error" + (propTypesErrors.length > 1 ? "s" : ""),
    )
    throw propTypesErrors
  }

  return ReactPDF.renderToStream(<Component {...props} />)
}
