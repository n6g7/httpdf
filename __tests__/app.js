import axios from "axios"

const createSuite = call => () => {
  it("returns a pdf", async () => {
    const response = await call("http://localhost:8000/demo", null, {
      a: "a",
      b: "b",
    })

    expect(response.status).toBe(200)
    expect(response.headers["content-disposition"]).toBe('attachment; filename="demo.pdf"')
    expect(response.headers["content-type"]).toBe("application/pdf")
  })

  it("allows customising the filename", async () => {
    const filename = "abc.pdf"
    const response = await call("http://localhost:8000/demo", filename, {
      a: "a",
      b: "b",
    })

    expect(response.status).toBe(200)
    expect(response.headers["content-disposition"]).toBe(`attachment; filename="${filename}"`)
    expect(response.headers["content-type"]).toBe("application/pdf")
  })

  it("returns a 404 for inexistent files", async () => {
    expect.hasAssertions()

    try {
      await call("http://localhost:8000/nope")
    } catch (error) {
      expect(error.response.status).toBe(404)
      expect(error.response.data).toBe("document not found")
    }
  })

  it("accepts props", async () => {
    const response = await call("http://localhost:8000/demo", null, {
      a: "Hello",
      b: "World",
    })

    expect(response.status).toBe(200)
    expect(response.headers["content-disposition"]).toBe('attachment; filename="demo.pdf"')
    expect(response.headers["content-type"]).toBe("application/pdf")
  })

  it("returns a 400 when prop types errors", async () => {
    expect.hasAssertions()

    try {
      await call("http://localhost:8000/demo", null, {
        a: 1,
      })
    } catch (error) {
      expect(error.response.status).toBe(400)
      expect(error.response.data).toHaveProperty("errors")
      expect(error.response.data.errors).toContain(
        "The prop `b` is marked as required in `Test`, but its value is `undefined`.",
      )
    }
  })

  it("returns a 404 for non-document components", async () => {
    expect.hasAssertions()

    try {
      await call("http://localhost:8000/Side", null, {
        a: 1,
      })
    } catch (error) {
      expect(error.response.status).toBe(404)
      expect(error.response.data).toBe("document not found")
    }
  })
}

describe("httpdf", () => {
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

    try {
      await axios("http://localhost:8000/demo", {
        method: "DELETE",
        data: {},
      })
    } catch (error) {
      expect(error.response.status).toBe(405)
      expect(error.response.data).toBe("Method Not Allowed")
    }
  })
})
