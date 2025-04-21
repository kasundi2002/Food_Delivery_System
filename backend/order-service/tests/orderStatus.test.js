const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { createTestOrder } = require('./setup');
const orderService = require('../Services/orderService');
const notificationService = require('../Services/notificationService');

describe('Order Status Management', () => {
    let sendNotificationStub;

    beforeEach(() => {
        // Stub the notification service
        sendNotificationStub = sinon.stub(notificationService, 'sendStatusUpdateNotification').resolves();
    });

    afterEach(() => {
        sendNotificationStub.restore();
    });

    describe('updateOrderStatus', () => {
        it('should update order status with valid transition', async () => {
            const deliveryPerson = '507f1f77bcf86cd799439011';
            const order = await createTestOrder({
                status: 'Assigned',
                deliveryPerson
            });

            const updatedOrder = await orderService.updateOrderStatus(
                order._id,
                'Accepted',
                deliveryPerson
            );

            expect(updatedOrder.status).to.equal('Accepted');
            expect(updatedOrder.statusHistory).to.have.lengthOf(1);
            expect(updatedOrder.statusHistory[0].status).to.equal('Accepted');
            expect(sendNotificationStub.calledOnce).to.be.true;
        });

        it('should reject invalid status transition', async () => {
            const deliveryPerson = '507f1f77bcf86cd799439011';
            const order = await createTestOrder({
                status: 'Assigned',
                deliveryPerson
            });

            try {
                await orderService.updateOrderStatus(
                    order._id,
                    'Delivered',
                    deliveryPerson
                );
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.include('Invalid status transition');
                expect(sendNotificationStub.called).to.be.false;
            }
        });

        it('should reject update from unauthorized delivery person', async () => {
            const order = await createTestOrder({
                status: 'Assigned',
                deliveryPerson: '507f1f77bcf86cd799439011'
            });

            try {
                await orderService.updateOrderStatus(
                    order._id,
                    'Accepted',
                    '507f1f77bcf86cd799439012' // different delivery person
                );
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.include('not assigned to this delivery person');
                expect(sendNotificationStub.called).to.be.false;
            }
        });
    });
});