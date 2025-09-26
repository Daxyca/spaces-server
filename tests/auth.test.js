import request from "supertest";
import { app } from "../app.js";
import "./setup.js";
import prisma from "../db/prisma.js";

describe("POST /api/auth/register", function () {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("registers a user", async function () {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "123", password: "123", email: "123@123.123" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.data).toBeDefined();

    const users = await prisma.user.findMany();
    expect(users.length).toBe(1);
  });
});
