import makeDebug from "debug";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { srcRoot, distRoot } from "./config.js";
import render from "./render.js";
import Resolver from "./resolve.js";
import { PropTypesError } from "./exceptions.js";

const debug = makeDebug("httpdf:app");

export default async function makeApp() {
  const app = express();
  const resolver = new Resolver(srcRoot, distRoot);

  if (process.env.HTTPDF_WATCH) await resolver.startWatching();
  else await resolver.indexOnce();

  debug("resolver ready");

  app.get("/health", (req, res) => {
    res.send({ status: "pass" });
  });

  app.use(morgan("dev"));
  app.use(bodyParser.json());

  app.use(async (req, res, next) => {
    req.state = {};
    try {
      req.state.document = resolver.resolve(req.path);
      next();
    } catch (error) {
      debug("Can't find %o", req.originalUrl);
      res.status(404).send("document not found");
    }
  });

  app.use(async (req, res, next) => {
    switch (req.method) {
      case "GET":
        req.state.props = req.query;
        next();
        break;
      case "POST":
      case "PUT":
        req.state.props = req.body;
        next();
        break;
      default:
        debug("Can't handle method %o", req.method);
        res.status(405).send("method not allowed");
    }
  });

  app.use(async (req, res) => {
    const {
      state: {
        document: {
          filename: defaultFilename,
          Component,
          propTypes,
          getAsyncProps,
        },
        props,
      },
      query: { filename = defaultFilename },
    } = req;

    try {
      const stream = await render(Component, props, propTypes, getAsyncProps);
      stream.pipe(res);
      res.set({
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/pdf",
      });
      debug("Returned %o", filename);
    } catch (error) {
      if (error instanceof PropTypesError) {
        debug("PropTypes errors:\n%o", error.errors);
        res.status(400).json({ errors: error.errors });
      } else {
        debug(error);
        res.status(500).send("internal server error");
      }
    }
  });

  return app;
}
