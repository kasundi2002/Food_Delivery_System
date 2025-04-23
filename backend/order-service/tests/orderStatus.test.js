require("./setup");
const mongoose = require("mongoose");
const { createTestOrder } = require("./testUtils");
const Order = require("../Models/Order");

describe("Order Status Updates", () => {
  it("should update status and lastUpdated", async () => {
    const order = await createTestOrder();
    order.status = "OnTheWay";
    order.lastUpdated = new Date();
    const updated = await order.save();

    expect(updated.status).toBe("OnTheWay");
    expect(updated.lastUpdated).toBeInstanceOf(Date);
  });

  it("should append statusHistory entry", async () => {
    const userId = new mongoose.Types.ObjectId();
    const order = await createTestOrder();

    order.status = "PickedUp";
    order.statusHistory.push({
      status: "PickedUp",
      updatedBy: userId,
    });

    await order.save();

    const found = await Order.findById(order._id);
    expect(found.statusHistory.length).toBe(1);
    expect(found.statusHistory[0].status).toBe("PickedUp");
    expect(found.statusHistory[0].updatedBy.toString()).toBe(userId.toString());
  });

  it("should not allow invalid status", async () => {
    const order = await createTestOrder();
    order.status = "Teleporting"; // Invalid

    let error;
    try {
      await order.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
  });
});
