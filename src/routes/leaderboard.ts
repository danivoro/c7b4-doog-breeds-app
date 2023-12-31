import express, { Router } from "express";
import { Client } from "pg";
import { useErrorHandler } from "../utils/errorHandler";
import { z } from "zod";

interface LeaderboardRow {
    id: number;
    breed: string;
    votes: number;
}

const breedSchema = z.string().min(1);

export default function createLeaderboardRouter(client: Client): Router {
    const router = express.Router();

    router.get<{}, LeaderboardRow[]>(
        "/",
        useErrorHandler(async (_req, res) => {
            const result = await client.query(
                "SELECT * FROM leaderboard ORDER BY votes DESC LIMIT 10"
            );
            res.status(200).json(result.rows);
        })
    );

    router.put<{}, LeaderboardRow, Pick<LeaderboardRow, "breed">>(
        "/",
        useErrorHandler(async (req, res) => {
            breedSchema.parse(req.body.breed);
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
