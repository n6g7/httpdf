import makeDebug from "debug"
import path from "path"
import walk from "walk"

const allowedExtensions = [".js", ".jsx"]
const debug = makeDebug("httpdf:resolver")

function buildResolverIndex(root) {
  debug("Indexing %o...", root)
  root = path.resolve(root)
  const walker = walk.walk(root)
  const index = {}

  return new Promise((resolve, reject) => {
    walker.on("file", (currenRoot, stats, next) => {
      const extension = path.extname(stats.name)
      const basename = path.basename(stats.name, extension)

      if (allowedExtensions.includes(extension)) {
        const filePath = path.resolve(currenRoot, stats.name)
        const relative = path.relative(root, filePath)
        const relativeDir = path.dirname(relative)
        const trimed = path.join(relativeDir, basename)

        const url = `/${trimed}`
        index[url] = {
          filename: `${basename}.pdf`,
          Component: require("./" + path.relative(__dirname, filePath)).default,
        }

        debug("Indexed %o (%o)", relative, url)
      }

      next()
    })

    walker.on("errors", reject)
    walker.on("end", () => {
      debug("Found %o files", Object.keys(index).length)
      resolve(index)
    })
  })
}

async function buildResolver(root) {
  const index = await buildResolverIndex(root)
  return key => index[key]
}

export default buildResolver
