import request from "supertest";
import { app } from "../src/app.js";

describe("Auth API", () => {
  it("GET / debe responder 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("POST /api/auth/register sin datos -> 400", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
  });

  it("POST /api/auth/login sin datos -> 400", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
  });

  it("GET /api/auth/me sin token -> 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});