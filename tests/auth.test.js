import request from "supertest";
import { app } from "../app.js";
import "./setup.js";
import prisma from "../db/prisma.js";

const USER = { username: "123", password: "123", email: "123@123.123" };

describe("authRouter /api/auth", function () {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  it("POST ./register registers a user", async function () {
    const user = USER;
    const response = await request(app)
      .post("/api/auth/register")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.data.username).toBe(user.username);

    const users = await prisma.user.findMany();
    expect(users.length).toBe(1);
  });

  it("POST ./login logs a valid user in", async function () {
    const user = USER;
    const response = await request(app)
      .post("/api/auth/login")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.data.username).toBe(user.username);
  });

  it("POST ./login returns 401 on wrong credentials", async function () {
    const wrongCredentials = { username: "john", password: "321" };
    const response = await request(app)
      .post("/api/auth/login")
      .send(wrongCredentials)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body.error).toBeDefined();
  });
});
