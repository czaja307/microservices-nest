#!/bin/bash

echo "Building all microservices..."

docker build -t food-app/order-service ./order-service &
docker build -t food-app/payment-service ./payment-service &
docker build -t food-app/meal-service ./meal-service &
docker build -t food-app/delivery-service ./delivery-service &
docker build -t food-app/review-service ./review-service &

wait

echo "All services have been built successfully!"
