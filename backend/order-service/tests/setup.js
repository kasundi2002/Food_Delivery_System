const mongoose = require('mongoose');
const config = require('../config/test');
const Order = require('../Models/Order');

before(async () => {
    await mongoose.connect(config.mongoURI);
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Order.deleteMany({});
});

// Test helper functions
const createTestOrder = async (data = {}) => {
    const defaultOrder = {
        customerId: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(),
        deliveryPerson: new mongoose.Types.ObjectId(),
        items: [{ name: 'Test Item', quantity: 1 }],
        total: 10.99,
        deliveryLocation: {
            type: 'Point',
            coordinates: [-73.856077, 40.848447]
        },
        restaurantLocation: {
            type: 'Point',
            coordinates: [-73.856077, 40.848447]
        },
        status: 'Pending',
        ...data
    };

    return await Order.create(defaultOrder);
};

module.exports = {
    createTestOrder
};