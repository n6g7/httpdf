import path from "path"
import walk from "walk"

const allowedExtensions = [".js", ".jsx"]

function buildResolverIndex(root) {
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

        index[`/${trimed}`] = {
          filename: `${basename}.pdf`,
          Component: require("./" + path.relative(__dirname, filePath)).default,
        }
      }

      next()
    })

    walker.on("errors", reject)
    walker.on("end", () => resolve(index))
  })
}

async function buildResolver(root) {
  const index = await buildResolverIndex(root)
  return key => index[key]
}

export default buildResolver
