const chai = require('chai');
const expect = chai.expect;
const { createTestOrder } = require('./setup');
const orderService = require('../Services/orderService');
const mongoose = require('mongoose');

describe('Delivery History', () => {
    const deliveryPerson = '507f1f77bcf86cd799439011';

    describe('getDeliveryHistory', () => {
        beforeEach(async () => {
            // Create sample orders with different dates and statuses
            const baseDate = new Date('2025-04-19');
            
            // Create a completed order from yesterday
            await createTestOrder({
                deliveryPerson,
                status: 'Delivered',
                createdAt: new Date(baseDate),
                statusHistory: [
                    {
                        status: 'Accepted',
                        timestamp: new Date(baseDate.getTime() + 1000 * 60 * 5), // +5 minutes
                        updatedBy: deliveryPerson
                    },
                    {
                        status: 'PickedUp',
                        timestamp: new Date(baseDate.getTime() + 1000 * 60 * 15), // +15 minutes
                        updatedBy: deliveryPerson
                    },
                    {
                        status: 'Delivered',
                        timestamp: new Date(baseDate.getTime() + 1000 * 60 * 45), // +45 minutes
                        updatedBy: deliveryPerson
                    }
                ]
            });

            // Create an in-progress order
            await createTestOrder({
                deliveryPerson,
                status: 'OnTheWay',
                createdAt: new Date(),
                statusHistory: [
                    {
                        status: 'Accepted',
                        timestamp: new Date(),
                        updatedBy: deliveryPerson
                    }
                ]
            });

            // Create an order assigned to different delivery person
            await createTestOrder({
                deliveryPerson: '507f1f77bcf86cd799439012',
                status: 'Delivered'
            });
        });

        it('should return only orders for the specified delivery person', async () => {
            const history = await orderService.getDeliveryHistory(deliveryPerson);
            expect(history).to.have.lengthOf(2);
            history.forEach(order => {
                expect(order.deliveryPerson.toString()).to.equal(deliveryPerson);
            });
        });

        it('should filter orders by date range', async () => {
            const history = await orderService.getDeliveryHistory(deliveryPerson, {
                startDate: '2025-04-19',
                endDate: '2025-04-19'
            });
            
            expect(history).to.have.lengthOf(1);
            expect(history[0].status).to.equal('Delivered');
        });

        it('should filter orders by status', async () => {
            const history = await orderService.getDeliveryHistory(deliveryPerson, {
                status: 'OnTheWay'
            });
            
            expect(history).to.have.lengthOf(1);
            expect(history[0].status).to.equal('OnTheWay');
        });

        it('should include delivery metrics for completed orders', async () => {
            const history = await orderService.getDeliveryHistory(deliveryPerson, {
                status: 'Delivered'
            });
            
            expect(history).to.have.lengthOf(1);
            const order = history[0];
            
            expect(order.metrics).to.exist;
            expect(order.metrics.totalDeliveryTime).to.exist;
            expect(order.metrics.pickupTime).to.exist;
            expect(order.metrics.transitTime).to.exist;
            
            // Verify metrics calculations
            expect(order.metrics.totalDeliveryTime).to.equal(40 * 60 * 1000); // 40 minutes in milliseconds
            expect(order.metrics.pickupTime).to.equal(10 * 60 * 1000); // 10 minutes in milliseconds
            expect(order.metrics.transitTime).to.equal(30 * 60 * 1000); // 30 minutes in milliseconds
        });
    });
});