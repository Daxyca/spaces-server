import request from "supertest";
import { app } from "../app.js";
import { createRandomUser } from "../utils/faker.js";
import "./setup.js";
import prisma from "../db/prisma.js";

describe("authRouter /api/auth", function () {
  const USER = createRandomUser();
  const USER_CREDENTIALS = { username: USER.username, password: USER.password };
  const WRONG_CREDENTIALS = {
    username: USER.username,
    password: USER.username,
  };

  let cookie;
  let invalidCookie;

  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  test("POST ./register registers a user", async function () {
    const user = USER;
    const res = await request(app)
      .post("/api/auth/register")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(201);
    const users = await prisma.user.findUniqueOrThrow({
      where: {
        username: user.username,
      },
    });
    expect(res.body.data.username).toBe(user.username);
  });

  test("POST ./login logs a valid user in", async function () {
    const user = USER_CREDENTIALS;
    const res = await request(app)
      .post("/api/auth/login")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.data.username).toBe(user.username);
    cookie = res.headers["set-cookie"][0];
  });

  test("POST ./login responds error on wrong credentials", async function () {
    const user = WRONG_CREDENTIALS;
    const res = await request(app)
      .post("/api/auth/login")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(401);
    expect(res.body.error).toBeDefined();
    invalidCookie = res.headers["set-cookie"][0];
  });

  test("GET ./login responds with user information when logged in", async function () {
    const res = await request(app)
      .get("/api/auth/login")
      .set("Cookie", cookie)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.data.username).toBe(USER_CREDENTIALS.username);
  });

  test("GET ./login responds with error when not logged in", async function () {
    const res = await request(app)
      .get("/api/auth/login")
      .set("Cookie", invalidCookie)
      .expect("Content-Type", /json/)
      .expect(401);
    expect(res.body.error).toBeDefined();
  });

  test("DELETE ./logout logs the session out", async function () {
    const res = await request(app)
      .delete("/api/auth/logout")
      .set("Cookie", cookie)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.message).toBeDefined();
    const res2 = await request(app)
      .get("/api/auth/login")
      .set("Cookie", cookie)
      .expect("Content-Type", /json/)
      .expect(401);
    expect(res2.body.error).toBeDefined();
  });

  test("DELETE ./logout responds with error when not logged in", async function () {
    const res = await request(app)
      .delete("/api/auth/logout")
      .set("Cookie", cookie)
      .expect("Content-Type", /json/)
      .expect(401);
    expect(res.body.error).toBeDefined();
  });
});
