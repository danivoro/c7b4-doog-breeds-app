import express, { Router } from "express";
import { Client } from "pg";
import { useErrorHandler } from "../utils/errorHandler";

export default function createHealthCheckRouter(client: Client): Router {
    const router = express.Router();

    router.get(
        "/",
        useErrorHandler(async (_req, res) => {
            await client.query("select now()");
            res.status(200).send("system ok");
        })
    );

    return router;
}
