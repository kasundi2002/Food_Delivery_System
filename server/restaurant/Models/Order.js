const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      restaurantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
      },

      items: [
        {
          foodItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodItem',
            required: true,
          },

          name: String, // Snapshot in case name changes later
          
          quantity: {
            type: Number,
            required: true,
            min: 1,
          }

        //   price: {
        //     type: Number,
        //     required: true,
        //   }
        },
      ],

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

      //fetch restaurant location from restaurantID
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

      paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Credit Card', 'UPI', 'Net Banking'],
        required: true,
      },

      paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
      },


      status: {
        type: String,
        enum: [
          'Placed', 
          'Preparing',
          'Ready for Pickup', 
          'On the way', 
          'Delivered', 
          'Cancelled',
          "Pending",
          "Assigned",
          "Accepted",
          "PickedUp",
          "OnTheWay",
          "Delivered",
        ],
        default: 'Placed',
      },

      totalAmount: {
        type: Number,
        required: true,
      },

      deliveryTimeEstimate: {
        type: Date,
      },

      deliveredAt: {
        type: Date,
      },

      isCancelled: {
        type: Boolean,
        default: false,
      },

      cancellationReason: {
        type: String,
      },

      //kasundi's
      
      deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPerson",
        default: null,
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
    {
      timestamps: true, // Automatically adds createdAt and updatedAt
    }
  );

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;