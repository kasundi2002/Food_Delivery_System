const mongoose = require('mongoose');
const config = require('../config/test');

async function setupTestEnvironment() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongoURI);
        console.log('Connected to test database');
        
        // Clean up any existing test data
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        console.log('Test database cleaned');
        
        // Close the connection
        await mongoose.connection.close();
        console.log('Test environment setup complete');
        
    } catch (error) {
        console.error('Error setting up test environment:', error);
        process.exit(1);
    }
}

setupTestEnvironment();