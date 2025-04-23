const request = require("supertest");
const app = require("../server");
const { setupDatabase, token, testOrderId } = require("./testUtils");

beforeAll(async () => {
  await setupDatabase();
});


describe("POST /api/delivery/accept/:orderId", () => {
  it("should allow delivery person to accept an order", async () => {
    const res = await request(app)
      .post(`/api/delivery/accept/${testOrderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.deliveryPerson).toBeDefined();
  });
});
