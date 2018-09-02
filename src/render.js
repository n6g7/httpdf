import React from "react"
import ReactPDF from "@react-pdf/node"

export default (Component, props) => ReactPDF.renderToStream(<Component {...props} />)
