import express from "express";

// NOTE! Function name can't start with underscore.

const exampleCloudFunction = (req: express.Request, res: express.Response) => {
  res.status(200).send("Example cloud function");
};

const anotherExampleCloudFunction = (
  req: express.Request,
  res: express.Response
) => {
  res.status(200).send("fetch another properties");
};

export { exampleCloudFunction, anotherExampleCloudFunction };
