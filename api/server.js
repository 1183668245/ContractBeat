import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";
import "./services/db.js";
import projectRouter from "./routes/project.js";
import createRouter from "./routes/create.js";
import plazaRouter from "./routes/plaza.js";
import musicRouter from "./routes/music.js";
import imageRouter from "./routes/image.js";

const app = express();

const allowedOrigins = new Set(env.frontendOrigins);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.serveStaticFrontend) {
  app.use(express.static(process.cwd()));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: env.nodeEnv });
});

app.use("/api/project", projectRouter);
app.use("/api/create", createRouter);
app.use("/api/plaza", plazaRouter);
app.use("/api/music", musicRouter);
app.use("/api/image", imageRouter);

app.listen(env.port, () => {
  console.log(`ContractBeat API running at ${env.publicBaseUrl}`);
});