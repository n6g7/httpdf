import makeDebug from "debug";
import makeApp from "./app.js";

const debug = makeDebug("httpdf:index");

makeApp().then((app) => {
  app.listen(process.env.PORT);
  debug("httpdf listening on %o", process.env.PORT);
});
