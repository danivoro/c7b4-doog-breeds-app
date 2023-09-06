import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { Client } from "pg";
import createLeaderboardRouter from "./routes/leaderboard";
import createRootRouter from "./routes/root";
import createHealthCheckRouter from "./routes/healthCheck";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";
import { errorHandler } from "./utils/errorHandler";

dotenv.config();

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

app.use("/", createRootRouter());
app.use("/leaderboard", createLeaderboardRouter(client));
app.use("/health-check", createHealthCheckRouter(client));

app.use(errorHandler);

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await client.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}
