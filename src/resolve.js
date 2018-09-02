import { Test } from "./documents"

export const buildResolver = path => {
  return key => {
    return {
      filename: "test.pdf",
      Component: Test,
    }
    // throw "nope"
  }
}

export default buildResolver("./documents")
