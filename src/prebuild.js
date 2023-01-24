import { srcRoot, distRoot } from "./config.js";
import Resolver from "./resolve.js";

const resolver = new Resolver(srcRoot, distRoot, true);
resolver.indexOnce();
