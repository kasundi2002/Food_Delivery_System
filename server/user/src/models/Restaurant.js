const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantName: { type: String },
    restaurantOwner: { type: String, required: true },
    address: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    category: { type: String },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ address: "2dsphere" });


module.exports = mongoose.model("Restaurant", restaurantSchema);