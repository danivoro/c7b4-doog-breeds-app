import express, { Router } from "express";
import { Client } from "pg";
import { useErrorHandler } from "../utils/errorHandler";

interface LeaderboardRow {
    id: number;
    breed: string;
    votes: number;
}

export function createLeaderboardRouter(client: Client): Router {
    const router = express.Router();

    router.get<{}, LeaderboardRow[] | string>(
        "/",
        useErrorHandler(async (_req, res) => {
            const result = await client.query(
                "SELECT * FROM leaderboard ORDER BY votes DESC LIMIT 10"
            );
            res.status(200).json(result.rows);
        })
    );

    router.put<{}, LeaderboardRow | string, { breed: string }>(
        "/",
        useErrorHandler(async (req, res) => {
            const result = await client.query(
                `INSERT INTO leaderboard (breed)
                    VALUES ($1)
                    ON CONFLICT (breed)
                    DO UPDATE SET votes = leaderboard.votes + 1
                    RETURNING *`,
                [req.body.breed]
            );
            res.status(201).json(result.rows[0]);
        })
    );

    return router;
}
