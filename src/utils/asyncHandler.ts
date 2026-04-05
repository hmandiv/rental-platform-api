import { RequestHandler } from "express";
import AsyncRouteHandler from "../types/asyncRouteHandler";

export const asyncHandler = (handler: AsyncRouteHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
