#!/bin/bash

echo "Starting all microservices"

docker start meal-service payment-service order-service delivery-service review-service

echo "All services have been started"
echo "Services are running on:"
echo "Order Service: http://localhost:3000"
echo "Payment Service: http://localhost:3001"
echo "Meal Service: http://localhost:3002"
echo "Delivery Service: http://localhost:3003"
echo "Review Service: http://localhost:3004"