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

const app = express();
const __dirname = process.cwd();
const assetsPath = path.join(__dirname, "public");
const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

// Middlewares
const corsOptions = {
  origin: /^https?:\/\/localhost(?::\d{2,4})?$/,
  credentials: true,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true },
  })
);
app.use(passport.session());

// Routes
app.use("/api", apiRouter);

// Static assets
app.use(express.static(assetsPath));

// Not Found
app.get("/*path", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error Handlers
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred",
      details: err.details || undefined,
    },
  });
});

//Server
const PORT = 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log("App listening at PORT", PORT);
});
