const mongoose = require("mongoose");
const Order = require("../Models/Order");

beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://kasundi2002:kasundi@forum.0prmr.mongodb.net/DS?retryWrites=true&w=majority&appName=Forum"
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Order.deleteMany({});
});
