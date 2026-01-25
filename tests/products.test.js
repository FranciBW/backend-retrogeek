import request from "supertest";
import { app } from "../src/app.js";

describe("Products API", () => {
  it("GET /api/products debe responder 200", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
  });

  it("POST /api/products sin token -> 401", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test",
      category: "Nintendo",
      condition: "Usado",
      price: 1000,
    });
    expect(res.statusCode).toBe(401);
  });
});