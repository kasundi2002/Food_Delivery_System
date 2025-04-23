const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      default: null,
    },
    items: [{ name: String, quantity: Number }],
    total: Number,

    // Delivery destination
    deliveryLocation: {
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

    // Restaurant origin location
    restaurantLocation: {
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

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Accepted",
        "PickedUp",
        "OnTheWay",
        "Delivered",
      ],
      default: "Pending",
    },

    // New fields for enhanced tracking
    lastUpdated: {
      type: Date,
      default: Date.now
    },

    statusHistory: [{
      status: {
        type: String,
        enum: [
          "Pending",
          "Assigned",
          "Accepted",
          "PickedUp",
          "OnTheWay",
          "Delivered",
        ]
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }],
  },
  { timestamps: true }
);

// Add geospatial index
orderSchema.index({ restaurantLocation: "2dsphere" });
orderSchema.index({ deliveryLocation: "2dsphere" });

module.exports = mongoose.model("Order", orderSchema);
