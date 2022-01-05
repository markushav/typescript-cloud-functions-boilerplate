import express from "express";
import * as functions from "./functions";
import fs from "fs";

const port = process.env.PORT ? process.env.PORT : 2021;
const server = express();
for (const key of Object.keys(functions)) {
  if (!key.startsWith("_")) {
    console.log(`Initiating route /${key}`);
    server.get(`/${key}`, functions[key]);
  }
}
server.get("/", (req, res) =>
  res.status(200).send(
    `<h1>Dev server for cloud functions</h1><h3>Endpoints</h3><ul>${Object.keys(
      functions
    )
      .filter((key) => !key.startsWith("_"))
      .map(
        (key) =>
          `<li><a href="${`http://localhost:${port}/${key}`}">/${key}</a></li>`
      )}</ul>`
  )
);
server.listen(port, () => console.log(`Listening on port ${port}`));

const cloudBuildObject = {
  steps: [
    {
      name: "gcr.io/cloud-builders/npm",
      args: ["install"],
    },
    {
      name: "gcr.io/cloud-builders/npm",
      args: ["run", "build"],
    },
    ...Object.keys(functions)
      .filter((key) => !key.startsWith("_"))
      .map((key) => ({
        name: "gcr.io/cloud-builders/gcloud",
        args: [
          "functions",
          "deploy",
          key,
          "--source",
          "functions",
          "--timeout",
          "540s",
          "--region",
          "europe-west1",
          "--trigger-http",
          "--allow-unauthenticated",
          "--runtime",
          "nodejs16",
          "--memory",
          "1024MB",
        ],
      })),
  ],
};

if (process.env.NODE_ENV !== "production") {
  fs.writeFileSync(
    "cloudbuild.json",
    JSON.stringify(cloudBuildObject, null, 2)
  );
}
