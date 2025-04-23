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

describe("PUT /api/delivery/profile", () => {
  it("should update delivery person profile", async () => {
    const token = getToken();
    const res = await request(app)
      .put("/api/delivery/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "0771234567" });

    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe("0771234567");
  });
});
