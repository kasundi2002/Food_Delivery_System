backend/                                        # All backend microservices
│   ├── .env.example                                # Global backend environment variable template (PORT, MONGODB_URI, JWT_SECRET, etc.)
│   ├── api-gateway/                                # API Gateway Service: central entry point for requests
│   │   ├── config/                                 # Configuration files (DB connections, API keys, etc.)
│   │   ├── src/
│   │   │   ├── app.js                              # Main Express app with a health-check route
│   │   │   └── routes/
│   │   │       └── gatewayRoutes.js                # Routing and middleware definitions
│   │   ├── Dockerfile                              # Docker configuration for API Gateway
│   │   ├── package.json                            # Dependencies and scripts (with "type": "module")
│   │   └── README.md                               # API Gateway documentation
│   ├── user-service/                               # User Management Service (handles Admin, Customer, Delivery)
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── app.js                              # Express app for user-service
│   │   │   ├── controllers/
│   │   │   │   └── userController.js               # Business logic for user operations (register, login, profile update)
│   │   │   ├── models/
│   │   │   │   └── User.js                         # MongoDB schema for users
│   │   │   ├── routes/
│   │   │   │   └── userRoutes.js                   # RESTful endpoints for user operations
│   │   │   ├── services/
│   │   │   │   └── authService.js                  # Authentication logic (JWT, hashing)
│   │   │   └── utils/
│   │   │       └── logger.js                       # Common logging utility
│   │   ├── Dockerfile                              # Docker config for user-service
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   ├── restaurant-service/                         # Restaurant & Menu Management Service
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── app.js                              # Express app for restaurant-service
│   │   │   ├── controllers/
│   │   │   │   └── restaurantController.js         # Business logic for restaurant and menu operations
│   │   │   ├── models/
│   │   │   │   ├── Restaurant.js                   # Schema for restaurant information
│   │   │   │   └── MenuItem.js                       # Schema for menu items
│   │   │   └── routes/
│   │   │       └── restaurantRoutes.js             # RESTful endpoints for restaurant management
│   │   ├── Dockerfile                              # Docker configuration for restaurant-service
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   ├── order-service/                              # Order Management Service
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── app.js                              # Express app for order-service
│   │   │   ├── controllers/
│   │   │   │   └── orderController.js              # Business logic for order processing
│   │   │   ├── models/
│   │   │   │   ├── Order.js                        # Schema for orders
│   │   │   │   └── OrderItem.js                    # Schema for order items
│   │   │   └── routes/
│   │   │       └── orderRoutes.js                  # RESTful endpoints for order operations
│   │   ├── Dockerfile                              # Docker configuration for order-service
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   ├── delivery-service/                           # Delivery Management Service
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── app.js                              # Express app for delivery-service
│   │   │   ├── controllers/
│   │   │   │   └── deliveryController.js           # Business logic for delivery operations
│   │   │   ├── models/
│   │   │   │   └── Delivery.js                     # Schema for delivery details
│   │   │   └── routes/
│   │   │       └── deliveryRoutes.js               # RESTful endpoints for delivery operations
│   │   ├── Dockerfile                              # Docker configuration for delivery-service
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   ├── payment-service/                            # Payment Integration Service
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── app.js                              # Express app for payment-service
│   │   │   ├── controllers/
│   │   │   │   └── paymentController.js            # Payment processing logic
│   │   │   ├── models/
│   │   │   │   └── Payment.js                      # Schema for payment transactions
│   │   │   └── routes/
│   │   │       └── paymentRoutes.js                # RESTful endpoints for payment operations
│   │   ├── Dockerfile                              # Docker configuration for payment-service
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   ├── notification-service/                       # Notification Service
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── app.js                              # Express app for notification-service
│   │   │   ├── controllers/
│   │   │   │   └── notificationController.js       # Logic for sending notifications (SMS, email)
│   │   │   └── routes/
│   │   │       └── notificationRoutes.js           # RESTful endpoints for notifications
│   │   ├── Dockerfile                              # Docker configuration for notification-service
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── README.md
│   └── common/                                     # Shared utilities for backend microservices
│       └── utils/
│           └── logger.js                           # Common logging utility
│