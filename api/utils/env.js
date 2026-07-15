import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3001),
  publicBaseUrl: process.env.PUBLIC_BASE_URL || "https://api.contractbeat.fun",
  frontendOrigins: (process.env.FRONTEND_ORIGINS || "https://contractbeat.fun,https://www.contractbeat.fun,http://localhost:3000,http://127.0.0.1:3000,http://localhost:5500,http://127.0.0.1:5500")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  serveStaticFrontend: process.env.SERVE_STATIC_FRONTEND === "true",
  apiBaseUrl: process.env.ROBIN_MELODY_API_BASE_URL || "https://api.openai.com/v1",
  apiKey: required("ROBIN_MELODY_API_KEY"),
  model: process.env.ROBIN_MELODY_MODEL || "gpt-4.1-mini",
  useRealAi: process.env.ROBIN_MELODY_USE_REAL_AI === "true",
  chatPath: process.env.ROBIN_MELODY_CHAT_PATH || "/v1/chat/completions",
  sunoSubmitPath: process.env.ROBIN_MELODY_SUNO_SUBMIT_PATH || "/suno/submit/music",
  sunoFetchPath: process.env.ROBIN_MELODY_SUNO_FETCH_PATH || "/suno/fetch",
  dexScreenerApiBase: process.env.DEX_SCREENER_API_BASE || "https://api.dexscreener.com",
  robinhoodBlockscoutBase:
    process.env.ROBINHOOD_BLOCKSCOUT_BASE || "https://robinhoodchain.blockscout.com/api/v2",
  sqlitePath: process.env.SQLITE_DB_PATH || "./api/data/robin-melody.db"
};