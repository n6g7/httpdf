import chokidar from "chokidar"
import child_process from "child_process"
import decache from "decache"
import makeDebug from "debug"
import path from "path"

const debug = makeDebug("httpdf:resolver")

class Resolver {
  allowedExtensions = ["js", "jsx"]

  constructor(srcRoot, distRoot, watch = false, build = true) {
    this.srcRoot = path.resolve(srcRoot)
    this.distRoot = path.resolve(distRoot)
    this.index = new Map()
    this.watch = watch
    this.build = build

    this.watcher = chokidar.watch(this.allowedExtensions.map(ext => `${this.srcRoot}/**/*.${ext}`))
    this.watcher.on("add", this.fileAdded.bind(this))
    this.watcher.on("change", this.fileChanged.bind(this))

    // Stop watching after "discovery round"
    if (!watch) this.watcher.on("ready", () => this.watcher.close())
  }

  resolve(key) {
    if (!this.index.has(key)) throw Error("document not found")
    return this.index.get(key)
  }

  relPath(srcPath) {
    return path.relative(this.srcRoot, srcPath)
  }

  distPath(srcPath) {
    return path.resolve(this.distRoot, this.relPath(srcPath))
  }

  async fileAdded(srcPath) {
    debug("%o added", srcPath)
    if (this.watch || this.build) await this.buildDocument(srcPath)
    this.indexDocument(srcPath)
  }

  async fileChanged(srcPath) {
    debug("%o changed", srcPath)
    if (this.watch || this.build) await this.buildDocument(srcPath)
    this.indexDocument(srcPath)
  }

  async buildDocument(srcPath) {
    const outDir = path.dirname(this.distPath(srcPath))

    await new Promise((resolve, reject) => {
      child_process.exec(`yarn build:doc ${srcPath} --out-dir ${outDir}`, err => {
        if (err) reject(err)
        else resolve()
      })
    })

    debug("Built %o", this.relPath(srcPath))
  }

  indexDocument(srcPath) {
    const relPath = this.relPath(srcPath)
    const distPath = this.distPath(srcPath)
    const extension = path.extname(srcPath)
    const basename = path.basename(srcPath, extension)
    const relativeDir = path.dirname(relPath)
    const trimed = path.join(relativeDir, basename)

    const url = `/${trimed}`
    const requirePath = `./${path.relative(__dirname, distPath)}`

    decache(requirePath)
    const Component = require(requirePath).default

    if (!Component.document) return

    this.index.set(url, {
      filename: `${basename}.pdf`,
      Component,
    })

    debug("Indexed %o (at url %o)", relPath, url)
  }
}

export default Resolver
