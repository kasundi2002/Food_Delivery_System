const request = require("supertest");
const app = require("../server");
const {
  setupDatabase,
  getToken,
  getDeliveryUserId,
  getTestOrderId,
} = require("./testUtils");

beforeAll(setupDatabase);

describe("POST /api/delivery/assign", () => {
  it("should assign an order to a delivery person", async () => {
    const token = getToken();
    const testOrderId = getTestOrderId();
    const res = await request(app)
      .post("/api/delivery/assign")
      .set("Authorization", `Bearer ${token}`)
      .send({ orderId: testOrderId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("deliveryPerson");
  });
});
