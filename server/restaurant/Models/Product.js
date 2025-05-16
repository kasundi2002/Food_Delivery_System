const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },
    url:{
      type:String
    },

    restaurantId: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      ref: "Restaurant",
      required: true,
    },

    category: {
      type: String,
      enum: ["main", "appetizers", "desserts", "beverages"],
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Product);
