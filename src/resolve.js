import chokidar from "chokidar";
import child_process from "child_process";
import makeDebug from "debug";
import path from "path";

import { URL } from "url";

const debug = makeDebug("httpdf:resolver");

const __dirname = new URL(".", import.meta.url).pathname;

const allowedExtensions = ["js", "jsx"];

class Resolver {
  constructor(srcRoot, distRoot, build = false) {
    this.srcRoot = path.resolve(srcRoot);
    this.distRoot = path.resolve(distRoot);
    this.index = new Map();
    this.currentlyBuilding = [];
    this.building = build;
    this.watching = false;

    this.seq = Promise.resolve();
  }

  async startWatching(watching = true) {
    this.watcher = chokidar.watch(
      allowedExtensions.map((ext) => `${this.srcRoot}/**/*.${ext}`),
    );
    this.watcher.on("add", (path) =>
      this.currentlyBuilding.push(this.fileAdded(path)),
    );
    this.watcher.on("change", (path) =>
      this.currentlyBuilding.push(this.fileChanged(path)),
    );
    this.watching = watching;

    await new Promise((resolve) => this.watcher.on("ready", resolve));
    await Promise.all(this.currentlyBuilding);
  }

  stopWatching() {
    this.watcher.close();
    this.watching = false;
  }

  async indexOnce() {
    await this.startWatching(false);
    this.watcher.close();
  }

  resolve(key) {
    if (!this.index.has(key)) throw Error("document not found");
    return this.index.get(key);
  }

  relPath(srcPath) {
    return path.relative(this.srcRoot, srcPath);
  }

  distPath(srcPath) {
    return path.resolve(this.distRoot, this.relPath(srcPath));
  }

  async fileAdded(srcPath) {
    debug("%o added", srcPath);
    if (this.watching || this.building) await this.buildDocument(srcPath);
    await this.indexDocument(srcPath);
  }

  async fileChanged(srcPath) {
    debug("%o changed", srcPath);
    if (this.watching || this.building) await this.buildDocument(srcPath);
    await this.indexDocument(srcPath);
  }

  async buildDocument(srcPath) {
    const outDir = path.dirname(this.distPath(srcPath));

    await new Promise((resolve, reject) => {
      child_process.exec(
        `yarn build:doc ${srcPath} --out-dir ${outDir}`,
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });

    debug("Built %o", this.relPath(srcPath));
  }

  // Two magic things happen here:
  // - through `this.seq` we force dynamic imports to be processed _sequentially_,
  //   this is because of https://github.com/facebook/jest/issues/11434
  // - we append a timestamp to each import url to manually bust the module cache,
  //   this has a nasty drawback: memory leak, cf. https://github.com/nodejs/modules/issues/307
  async import(path) {
    this.seq = this.seq.then(() => {
      debug(`Importing %s`, path);
      return import(`${path}?bust=${Date.now()}`);
    });

    return this.seq;
  }

  async indexDocument(srcPath) {
    const relPath = this.relPath(srcPath);
    const distPath = this.distPath(srcPath);
    const extension = path.extname(srcPath);
    const basename = path.basename(srcPath, extension);
    const relativeDir = path.dirname(relPath);
    const trimed = path.join(relativeDir, basename);

    const url = `/${trimed}`;
    const requirePath = `./${path.relative(__dirname, distPath)}`;

    const {
      default: Component,
      document,
      propTypes,
      getAsyncProps,
    } = await this.import(requirePath);

    if (!Component || !document) return;

    this.index.set(url, {
      filename: `${basename}.pdf`,
      Component,
      propTypes,
      getAsyncProps,
    });

    debug("Indexed %o (at url %o)", relPath, url);
  }
}

export default Resolver;
