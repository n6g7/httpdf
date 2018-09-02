import React from "react"
import ReactPDF from "@react-pdf/node"

import { Test } from "./documents"

export default props => ReactPDF.renderToStream(<Test {...props} />)
