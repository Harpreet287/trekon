#!/bin/bash

echo "ApacheBench Full Stack Test via API Gateway (localhost:8080)"

# 🔧 CONFIG
GATEWAY="http://localhost:8080/api"
USER_ID="6800c8cb94e9a76808f545ca"        # Set this after registration
HABIT_ID="6800ca0cd3c23b5f7cd7e97f"      # Set this after habit creation
WORKOUT_ID="6800cc81c5f69922d72a84c9"  # Set this after workout creation


echo ""
echo "Testing user login"
ab -n 100 -c 10 -T "application/json" -p login.json "$GATEWAY/user/login"

echo ""
echo "Testing get user by ID"
ab -n 100 -c 10 "$GATEWAY/user/$USER_ID"

echo ""
echo "Testing create habit"
ab -n 100 -c 10 -T "application/json" -p create-habit.json "$GATEWAY/habit"

echo ""
echo "🌱 Testing get all habits"
ab -n 100 -c 10 "$GATEWAY/habit"

echo ""
echo "Testing add habit to user"
ab -n 100 -c 10 -T "application/json" -p add-habit.json "$GATEWAY/user/$USER_ID/habit"

echo ""
echo "Testing check habit"
ab -n 100 -c 10 -T "application/json" -p check-habit.json "$GATEWAY/user/$USER_ID/checkHabit"

echo ""
echo "Testing get user habits"
ab -n 100 -c 10 "$GATEWAY/user/$USER_ID/habit"

echo ""
echo "Testing create workout"
ab -n 100 -c 10 -T "application/json" -p create-workout.json "$GATEWAY/workout"

echo ""
echo "Testing get all workouts"
ab -n 100 -c 10 "$GATEWAY/workout"

echo ""
echo "Testing add workout to user"
ab -n 100 -c 10 -T "application/json" -p add-workout.json "$GATEWAY/user/$USER_ID/workout"

echo ""
echo "Testing check workout"
ab -n 100 -c 10 -T "application/json" -p check-workout.json "$GATEWAY/user/$USER_ID/checkWorkout"

echo ""
echo "Testing get user workouts"
ab -n 100 -c 10 "$GATEWAY/user/$USER_ID/workout"


echo ""
echo "Test complete."
