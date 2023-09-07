import express from "express";

const router = express.Router();

router.get("/", async (_req, res) => {
    res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

export default router;
