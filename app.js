import "dotenv/config";
import express from "express";
import process from "process";
import path from "path";
import passport from "passport";
import "./config/passport.js";
import prisma from "./db/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import expressSession from "express-session";
import { apiRouter } from "./routes/apiRouter.js";
import cors from "cors";

export const app = express();
app.set("trust proxy", 1);
const __dirname = process.cwd();
const assetsPath = path.join(__dirname, "public");
const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: process.env.NODE_ENV === "test" ? undefined : 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

// Middlewares
const corsOptions = {
  origin: process.env.CLIENT_BASE_URL,
  credentials: true,
};
app.use(cors(corsOptions));
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}
app.use(express.json());
const secure =
  !process.env.NODE_ENV.startsWith("dev") && process.env.NODE_ENV !== "test";
const sameSite = secure ? "none" : "lax";
app.use(
  expressSession({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure,
      sameSite,
    },
  })
);
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.redirect(process.env.CLIENT_BASE_URL));
app.use("/api", apiRouter);

// Static assets
app.use(express.static(assetsPath));

// Not Found
app.get("/*path", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error Handlers
app.use((err, req, res, next) => {
  if (!err.status) {
    console.error(err);
  }
  res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred",
      details: err.details || undefined,
      errors: err.errors || undefined,
    },
  });
});
