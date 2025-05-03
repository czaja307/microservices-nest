#!/bin/bash

echo "Stopping all microservices..."

docker stop order-service payment-service meal-service delivery-service review-service

echo "All services have been stopped!"