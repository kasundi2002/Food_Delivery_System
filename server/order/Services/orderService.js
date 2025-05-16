const Order = require("../Models/Order");
const axios = require("axios"); // For calling user service

const USER_SERVICE_URL = "http://localhost:3001/api/auth"; // Replace with actual URL

/**
 * Update the status of an order
 */
const updateOrderStatus = async (orderId, status, deliveryPersonId) => {

  try {
    
    const order = await Order.findOne({
      _id: orderId,
      deliveryPerson: deliveryPersonId,
    });

    if (!order) {
      throw new Error(
        "Order not found or not assigned to this delivery person"
      );
    }

    const previousStatus = order.status;

    const validTransitions = {
      Assigned: ["Accepted"],
      Accepted: ["PickedUp"],
      PickedUp: ["OnTheWay"],
      OnTheWay: ["Delivered"],
    };

    if (
      validTransitions[order.status] &&
      !validTransitions[order.status].includes(status)
    ) {
      throw new Error(
        `Invalid status transition from ${order.status} to ${status}`
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        lastUpdated: new Date(),
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status,
            timestamp: new Date(),
            updatedBy: deliveryPersonId,
          },
        ],
      },
      { new: true }
    );

    //await sendStatusUpdateNotification(updatedOrder, previousStatus);
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

/**
 * Get delivery history for a specific delivery person
 */
const getDeliveryHistory = async (deliveryPersonDriverId, filters = {}) => {
  try {
    const query = { deliveryPerson: deliveryPersonDriverId };

    if (filters.status) {
      query.status = filters.status; // Filter by status
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .select("+statusHistory")
      .exec();

    const ordersWithData = await Promise.all(
      orders.map(async (order) => {
        const metrics = calculateDeliveryMetrics(order);
        const orderObj = order.toObject();

        // Fetch customer data
        let customer = null;
        try {
          const res = await axios.get(
            `${USER_SERVICE_URL}/${order.customerId}`
          );
          customer = res.data;
        } catch (err) {
          customer = { name: "Unknown", email: "Unavailable" };
        }

        // Simulate restaurant data (as restaurant service is not implemented)
        const restaurant = {
          name: "Sample Restaurant",
          location: "Sample Location",
        };

        return {
          ...orderObj,
          customer,
          restaurant, // Hardcoded restaurant data
          metrics,
        };
      })
    );

    return ordersWithData;
  } catch (error) {
    throw error;
  }
};


// Helper to calculate delivery metrics
const calculateDeliveryMetrics = (order) => {
  const metrics = {
    totalDeliveryTime: null,
    pickupTime: null,
    transitTime: null,
  };

  if (!order.statusHistory) return metrics;

  const findStatusTimestamp = (status) => {
    const entry = order.statusHistory.find((h) => h.status === status);
    return entry ? new Date(entry.timestamp) : null;
  };

  const acceptedTime = findStatusTimestamp("Accepted");
  const pickedUpTime = findStatusTimestamp("PickedUp");
  const deliveredTime = findStatusTimestamp("Delivered");

  if (acceptedTime && deliveredTime) {
    metrics.totalDeliveryTime = deliveredTime - acceptedTime;
  }

  if (acceptedTime && pickedUpTime) {
    metrics.pickupTime = pickedUpTime - acceptedTime;
  }

  if (pickedUpTime && deliveredTime) {
    metrics.transitTime = deliveredTime - pickedUpTime;
  }

  return metrics;
};

module.exports = {
  updateOrderStatus,
  getDeliveryHistory,
};

// const axios = require('axios'); // For calling user and restaurant services

// const USER_SERVICE_URL = 'http://user-service/api/users'; // Change to actual URL
// const RESTAURANT_SERVICE_URL = 'http://restaurant-service/api/restaurants'; // Change to actual URL

// /**
//  * Update the status of an order
//  */
// const updateOrderStatus = async (orderId, status, deliveryPersonId) => {
//     try {
//         const order = await Order.findOne({ 
//             _id: orderId,
//             deliveryPerson: deliveryPersonId
//         });

//         if (!order) {
//             throw new Error('Order not found or not assigned to this delivery person');
//         }

//         const previousStatus = order.status;

//         const validTransitions = {
//             'Assigned': ['Accepted'],
//             'Accepted': ['PickedUp'],
//             'PickedUp': ['OnTheWay'],
//             'OnTheWay': ['Delivered']
//         };

//         if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
//             throw new Error(`Invalid status transition from ${order.status} to ${status}`);
//         }

//         const updatedOrder = await Order.findByIdAndUpdate(
//             orderId,
//             { 
//                 status,
//                 lastUpdated: new Date(),
//                 statusHistory: [...(order.statusHistory || []), {
//                     status,
//                     timestamp: new Date(),
//                     updatedBy: deliveryPersonId
//                 }]
//             },
//             { new: true }
//         );

//         await sendStatusUpdateNotification(updatedOrder, previousStatus);
//         return updatedOrder;
//     } catch (error) {
//         throw error;
//     }
// };

// /**
//  * Get delivery history for a specific delivery person
//  */
// const getDeliveryHistory = async (deliveryPersonId, filters = {}) => {
//     try {
//         const query = { deliveryPerson: deliveryPersonId };

//         if (filters.startDate || filters.endDate) {
//             query.createdAt = {};
//             if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
//             if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
//         }

//         if (filters.status) {
//             query.status = filters.status;
//         }

//         const orders = await Order.find(query)
//             .sort({ createdAt: -1 })
//             .select('+statusHistory')
//             .exec();

//         const ordersWithData = await Promise.all(orders.map(async order => {
//             const metrics = calculateDeliveryMetrics(order);
//             const orderObj = order.toObject();

//             // Fetch customer data
//             let customer = null;
//             try {
//                 const res = await axios.get(`${USER_SERVICE_URL}/${order.customerId}`);
//                 customer = res.data;
//             } catch (err) {
//                 customer = { name: 'Unknown', email: 'Unavailable' };
//             }

//             // Fetch restaurant data
//             let restaurant = null;
//             try {
//                 const res = await axios.get(`${RESTAURANT_SERVICE_URL}/${order.restaurantId}`);
//                 restaurant = res.data;
//             } catch (err) {
//                 restaurant = { name: 'Unknown', location: 'Unavailable' };
//             }

//             return {
//                 ...orderObj,
//                 customer,
//                 restaurant,
//                 metrics
//             };
//         }));

//         return ordersWithData;
//     } catch (error) {
//         throw error;
//     }
// };

// // Helper to calculate delivery metrics
// const calculateDeliveryMetrics = (order) => {
//     const metrics = {
//         totalDeliveryTime: null,
//         pickupTime: null,
//         transitTime: null
//     };

//     if (!order.statusHistory) return metrics;

//     const findStatusTimestamp = (status) => {
//         const entry = order.statusHistory.find(h => h.status === status);
//         return entry ? new Date(entry.timestamp) : null;
//     };

//     const acceptedTime = findStatusTimestamp('Accepted');
//     const pickedUpTime = findStatusTimestamp('PickedUp');
//     const deliveredTime = findStatusTimestamp('Delivered');

//     if (acceptedTime && deliveredTime) {
//         metrics.totalDeliveryTime = deliveredTime - acceptedTime;
//     }

//     if (acceptedTime && pickedUpTime) {
//         metrics.pickupTime = pickedUpTime - acceptedTime;
//     }

//     if (pickedUpTime && deliveredTime) {
//         metrics.transitTime = deliveredTime - pickedUpTime;
//     }

//     return metrics;
// };

// module.exports = {
//     updateOrderStatus,
//     getDeliveryHistory
// };

