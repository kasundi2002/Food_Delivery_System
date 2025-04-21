const makeServiceRequest = require('../Services/serviceRequest');

/**
 * Send notifications for order status updates
 * @param {Object} order - The updated order object
 * @param {string} previousStatus - The previous status of the order
 */
const sendStatusUpdateNotification = async (order, previousStatus) => {
    try {
        // Prepare notification data
        const notificationData = {
            type: 'ORDER_STATUS_UPDATE',
            orderId: order._id,
            customerId: order.customerId,
            deliveryPersonId: order.deliveryPerson,
            previousStatus,
            currentStatus: order.status,
            timestamp: new Date()
        };

        // Send notification to customer
        await makeServiceRequest('user-service', 'POST', '/notifications/send', {
            userId: order.customerId,
            message: `Your order status has been updated from ${previousStatus} to ${order.status}`,
            data: notificationData
        });

        // Send notification to restaurant if relevant
        if (['PickedUp', 'Delivered'].includes(order.status)) {
            await makeServiceRequest('user-service', 'POST', '/notifications/send', {
                userId: order.restaurantId,
                message: `Order #${order._id} has been ${order.status.toLowerCase()}`,
                data: notificationData
            });
        }

    } catch (error) {
        console.error('Notification error:', error);
        // Don't throw the error as notifications are not critical
    }
};

module.exports = {
    sendStatusUpdateNotification
};