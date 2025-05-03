#!/bin/bash

echo "Removing all microservice containers..."

docker rm order-service
docker rm payment-service
docker rm meal-service
docker rm delivery-service
docker rm review-service

echo "All service containers have been removed!"