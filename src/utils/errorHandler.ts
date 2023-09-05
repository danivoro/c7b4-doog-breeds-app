import { NextFunction, Request, Response } from "express";

export const useErrorHandler = (
    routeHandler: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>
) => {
    return (req: Request, res: Response, next: NextFunction) =>
        routeHandler(req, res, next).catch((err) => next(err));
};

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);
    res.status(500).send("An error occurred. Check server logs.");
};
