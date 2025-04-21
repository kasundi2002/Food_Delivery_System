const Order = require('../Models/Order');
const { sendStatusUpdateNotification } = require('./notificationService');

/**
 * Update the status of an order
 * @param {string} orderId - The ID of the order to update
 * @param {string} status - New status of the order (Pending, Assigned, Accepted, PickedUp, OnTheWay, Delivered)
 * @param {string} deliveryPersonId - ID of the delivery person updating the status
 * @returns {Promise<Order>} Updated order object
 */
const updateOrderStatus = async (orderId, status, deliveryPersonId) => {
    try {
        // Verify that the order exists and belongs to the delivery person
        const order = await Order.findOne({ 
            _id: orderId,
            deliveryPerson: deliveryPersonId
        });

        if (!order) {
            throw new Error('Order not found or not assigned to this delivery person');
        }

        const previousStatus = order.status;

        // Validate status transition
        const validTransitions = {
            'Assigned': ['Accepted'],
            'Accepted': ['PickedUp'],
            'PickedUp': ['OnTheWay'],
            'OnTheWay': ['Delivered']
        };

        if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
            throw new Error(`Invalid status transition from ${order.status} to ${status}`);
        }

        // Update the order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                status: status,
                lastUpdated: new Date(),
                statusHistory: [...(order.statusHistory || []), {
                    status: status,
                    timestamp: new Date(),
                    updatedBy: deliveryPersonId
                }]
            },
            { new: true }
        );

        // Send notifications
        await sendStatusUpdateNotification(updatedOrder, previousStatus);

        return updatedOrder;
    } catch (error) {
        throw error;
    }
};

/**
 * Get delivery history for a specific delivery person
 * @param {string} deliveryPersonId - ID of the delivery person
 * @param {Object} filters - Optional filters for the query
 * @param {Date} filters.startDate - Start date for filtering orders
 * @param {Date} filters.endDate - End date for filtering orders
 * @param {string} filters.status - Status to filter by
 * @returns {Promise<Array>} Array of orders
 */
const getDeliveryHistory = async (deliveryPersonId, filters = {}) => {
    try {
        const query = {
            deliveryPerson: deliveryPersonId
        };

        // Add date range filter if provided
        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate) {
                query.createdAt.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                query.createdAt.$lte = new Date(filters.endDate);
            }
        }

        // Add status filter if provided
        if (filters.status) {
            query.status = filters.status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate('customerId', 'name email')
            .populate('restaurantId', 'name location')
            .select('+statusHistory')  // Include the statusHistory field
            .exec();

        // Add performance metrics
        const ordersWithMetrics = orders.map(order => {
            const metrics = calculateDeliveryMetrics(order);
            return {
                ...order.toObject(),
                metrics
            };
        });

        return ordersWithMetrics;
    } catch (error) {
        throw error;
    }
};

// Helper function to calculate delivery performance metrics
const calculateDeliveryMetrics = (order) => {
    const metrics = {
        totalDeliveryTime: null,
        pickupTime: null,
        transitTime: null
    };

    if (!order.statusHistory) return metrics;

    const findStatusTimestamp = (status) => {
        const entry = order.statusHistory.find(h => h.status === status);
        return entry ? entry.timestamp : null;
    };

    const acceptedTime = findStatusTimestamp('Accepted');
    const pickedUpTime = findStatusTimestamp('PickedUp');
    const deliveredTime = findStatusTimestamp('Delivered');

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
    getDeliveryHistory
};