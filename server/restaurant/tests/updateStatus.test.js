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

describe("PUT /api/delivery/status/:orderId", () => {
  it("should update the status of the order", async () => {
    const token = getToken();
    const testOrderId = getTestOrderId();

    const res = await request(app)
      .put(`/api/delivery/status/${testOrderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "OnTheWay" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("OnTheWay");
  });
});
