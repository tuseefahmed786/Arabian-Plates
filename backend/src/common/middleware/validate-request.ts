import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    schema.parse(payload);
    next();
  };
}
