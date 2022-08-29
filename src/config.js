export const srcRoot = process.env.HTTPDF_DOCUMENTS_SRC;
if (!srcRoot)
  throw Error(
    "Document root missing, set the HTTPDF_DOCUMENTS_SRC environment variable",
  );

export const distRoot = process.env.HTTPDF_DOCUMENTS_DIST;
if (!distRoot)
  throw Error(
    "Document root missing, set the HTTPDF_DOCUMENTS_DIST environment variable",
  );
