#!/bin/bash

echo "Running all microservices in interactive mode..."

docker run --name order-service -p 3000:3000 food-app/order-service &
docker run --name payment-service -p 3001:3000 food-app/payment-service &
docker run --name meal-service -p 3002:3000 food-app/meal-service &
docker run --name delivery-service -p 3003:3000 food-app/delivery-service &
docker run --name review-service -p 3004:3000 food-app/review-service &
echo "All services are running in interactive mode!"
echo "Services are accessible at the following URLs:"
echo "Order Service: http://localhost:3000"
echo "Payment Service: http://localhost:3001"
echo "Meal Service: http://localhost:3002"
echo "Delivery Service: http://localhost:3003"
echo "Review Service: http://localhost:3004"