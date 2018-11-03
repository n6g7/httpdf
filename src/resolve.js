import makeDebug from "debug"
import path from "path"
import walk from "walk"

const allowedExtensions = [".js", ".jsx"]
const debug = makeDebug("httpdf:resolver")

class Resolver {
  constructor(root) {
    this.root = root
    this.absoluteRoot = path.resolve(root)
  }

  buildIndex() {
    debug("Indexing %o...", this.root)
    this.index = new Map()
    const walker = walk.walk(this.absoluteRoot)

    return new Promise((resolve, reject) => {
      walker.on("file", (currenRoot, stats, next) => {
        const extension = path.extname(stats.name)
        const basename = path.basename(stats.name, extension)

        if (allowedExtensions.includes(extension)) {
          const filePath = path.resolve(currenRoot, stats.name)
          const relative = path.relative(this.absoluteRoot, filePath)
          const relativeDir = path.dirname(relative)
          const trimed = path.join(relativeDir, basename)

          const url = `/${trimed}`
          this.index.set(url, {
            filename: `${basename}.pdf`,
            Component: require("./" + path.relative(__dirname, filePath)).default,
          })

          debug("Indexed %o (%o)", relative, url)
        }

        next()
      })

      walker.on("errors", reject)
      walker.on("end", () => {
        debug("Found %o files", this.index.size)
        resolve()
      })
    })
  }

  resolve(key) {
    if (!this.index.has(key)) throw Error("document not found")
    return this.index.get(key)
  }
}

export default Resolver
