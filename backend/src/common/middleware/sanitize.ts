import { NextFunction, Request, Response } from "express";

function deepSanitize(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/[<>]/g, "");
  }

  if (Array.isArray(value)) {
    return value.map(deepSanitize);
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, val]) => {
      acc[key] = deepSanitize(val);
      return acc;
    }, {});
  }

  return value;
}

export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  req.body = deepSanitize(req.body);

  // Express 5 exposes req.query with a getter-only property.
  // Mutate its keys in-place instead of reassigning req.query.
  if (req.query && typeof req.query === "object") {
    for (const [key, value] of Object.entries(req.query)) {
      (req.query as Record<string, unknown>)[key] = deepSanitize(value);
    }
  }

  next();
}
