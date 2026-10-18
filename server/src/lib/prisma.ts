import { neonConfig } from "@neondatabase/serverless";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { env } from "../config/env.js";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
