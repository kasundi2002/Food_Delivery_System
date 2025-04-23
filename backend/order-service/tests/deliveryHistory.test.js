require("./setup");
const mongoose = require("mongoose");
const { createTestOrder } = require("./testUtils");
const Order = require("../Models/Order");

describe("Delivery History Query", () => {
  it("should return orders assigned to a specific delivery person", async () => {
    const dpId = new mongoose.Types.ObjectId();

    await createTestOrder({ deliveryPerson: dpId, status: "Delivered" });
    await createTestOrder({ deliveryPerson: dpId, status: "OnTheWay" });
    await createTestOrder({ status: "Pending" }); // Unassigned

    const history = await Order.find({ deliveryPerson: dpId });
    expect(history.length).toBe(2);
    history.forEach((order) => {
      expect(order.deliveryPerson.toString()).toBe(dpId.toString());
    });
  });

  it("should exclude orders not delivered by the delivery person", async () => {
    const dp1 = new mongoose.Types.ObjectId();
    const dp2 = new mongoose.Types.ObjectId();

    await createTestOrder({ deliveryPerson: dp1, status: "Delivered" });
    await createTestOrder({ deliveryPerson: dp2, status: "Delivered" });

    const history = await Order.find({ deliveryPerson: dp1 });
    expect(history.length).toBe(1);
    expect(history[0].deliveryPerson.toString()).toBe(dp1.toString());
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
    console.log("Found Order:", found); // 🔍 debug log

    expect(found).not.toBeNull(); // 💥 avoid accessing null
    expect(found.statusHistory.length).toBe(1);
    expect(found.statusHistory[0].status).toBe("PickedUp");
    expect(found.statusHistory[0].updatedBy.toString()).toBe(userId.toString());
  });

});
