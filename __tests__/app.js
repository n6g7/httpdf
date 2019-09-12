import axiosist from "axiosist"
import makeApp from "../src/app"

const createSuite = call => () => {
  it("returns a pdf", async () => {
    const response = await call("/demo", null, {
      a: "a",
      b: "b",
    })

    expect(response.status).toBe(200)
    expect(response.headers["content-disposition"]).toBe('attachment; filename="demo.pdf"')
    expect(response.headers["content-type"]).toBe("application/pdf")
  })

  it("allows customising the filename", async () => {
    const filename = "abc.pdf"
    const response = await call("/demo", filename, {
      a: "a",
      b: "b",
    })

    expect(response.status).toBe(200)
    expect(response.headers["content-disposition"]).toBe(`attachment; filename="${filename}"`)
    expect(response.headers["content-type"]).toBe("application/pdf")
  })

  it("returns a 404 for inexistent files", async () => {
    expect.hasAssertions()

    const response = await call("/nope")
    expect(response.status).toBe(404)
    expect(response.data).toBe("document not found")
  })

  it("accepts props", async () => {
    const response = await call("/demo", null, {
      a: "Hello",
      b: "World",
    })

    expect(response.status).toBe(200)
    expect(response.headers["content-disposition"]).toBe('attachment; filename="demo.pdf"')
    expect(response.headers["content-type"]).toBe("application/pdf")
  })

  it("returns a 400 when prop types errors", async () => {
    expect.hasAssertions()

    const response = await call("/demo", null, {
      a: 1,
    })
    expect(response.status).toBe(400)
    expect(response.data).toHaveProperty("errors")
    expect(response.data.errors).toContain(
      "The prop `b` is marked as required in `Test`, but its value is `undefined`.",
    )
  })

  it("returns a 404 for non-document components", async () => {
    expect.hasAssertions()

    const response = await call("/Side", null, {
      a: 1,
    })
    expect(response.status).toBe(404)
    expect(response.data).toBe("document not found")
  })
}

describe("httpdf", () => {
  let app, axios

  beforeAll(async () => {
    app = await makeApp()
    axios = axiosist(app)
  })

  describe(
    "GET",
    createSuite((url, filename, props) =>
      axios(url, {
        method: "GET",
        params: { filename, ...props },
      }),
    ),
  )

  describe(
    "POST",
    createSuite((url, filename, props) =>
      axios(url, {
        method: "POST",
        params: { filename },
        data: props,
      }),
    ),
  )

  describe(
    "PUT",
    createSuite((url, filename, props) =>
      axios(url, {
        method: "PUT",
        params: { filename },
        data: props,
      }),
    ),
  )

  it("returns a 405 for unsupported methods", async () => {
    expect.hasAssertions()

    const response = await axios("/demo", {
      method: "DELETE",
      data: {},
    })
    expect(response.status).toBe(405)
    expect(response.data).toBe("method not allowed")
  })

  it("returns a 200 on /health", async () => {
    const response = await axios.get("/health")
    expect(response.status).toBe(200)
    expect(response.data).toEqual({ status: "pass" })
  })
})
