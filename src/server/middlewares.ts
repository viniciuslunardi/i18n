import { NextFunction, Request, Response } from 'express';

const missingRouteMiddleware = (req: Request, res: Response) => {
  return res
    .status(404)
    .send(
      'This route is not mapped! Check README.md file for the documentation.'
    );
};

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Origin", "GET");
  
    next();
  };

export { missingRouteMiddleware, corsMiddleware };