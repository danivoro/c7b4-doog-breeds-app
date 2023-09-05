import express, { Router } from "express";
import { Client } from "pg";

interface LeaderboardRow {
    id: number;
    breed: string;
    votes: number;
}

export function leaderboardRoutes(client: Client): Router {
    const router = express.Router();

    router.get<{}, LeaderboardRow[] | string>("/", async (_req, res) => {
        try {
            const result = await client.query(
                "SELECT * FROM leaderboard ORDER BY votes DESC LIMIT 10"
            );
            res.status(200).json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });

    router.put<{}, LeaderboardRow | string, { breed: string }>(
        "/",
        async (req, res) => {
            try {
                const result = await client.query(
                    `INSERT INTO leaderboard (breed)
                    VALUES ($1)
                    ON CONFLICT (breed)
                    DO UPDATE SET votes = leaderboard.votes + 1
                    RETURNING *`,
                    [req.body.breed]
                );
                res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error(error);
                res.status(500).send("An error occurred. Check server logs.");
            }
        }
    );

    return router;
}
