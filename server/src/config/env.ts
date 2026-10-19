import "dotenv/config";

const getEnv = (variable: string) => {
  const result = process.env[variable];
  if (!result) {
    throw new Error(`${variable} is not set`);
  }
  return result;
};

const JWT_SECRET = getEnv("JWT_SECRET");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const PORT = Number(process.env.PORT) || 5000;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const DATABASE_URL = getEnv("DATABASE_URL");

const IS_PROD = (process.env.NODE_ENV || "development") === "production";

export const env = {
  PORT,
  IS_PROD,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLIENT_URL,
  DATABASE_URL,
};
