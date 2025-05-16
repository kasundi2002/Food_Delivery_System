const request = require("supertest");
const app = require("../server");
const {
  setupDatabase,
  getToken,
  getDeliveryUserId,
  getTestOrderId,
} = require("./testUtils");

beforeAll(async () => {
  await setupDatabase();
});


describe("GET /api/delivery/assigned", () => {
  it("should return assigned orders for the delivery person", async () => {
    const token = getToken();
    const res = await request(app)
      .get("/api/delivery/assigned")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
