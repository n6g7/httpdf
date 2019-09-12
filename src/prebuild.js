import { srcRoot, distRoot } from "./config"
import Resolver from "./resolve"

const resolver = new Resolver(srcRoot, distRoot, true)
resolver.indexOnce()
