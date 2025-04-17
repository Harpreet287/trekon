#!/bin/bash

GATEWAY="http://localhost:8080/api"
USER_ID="6800c8cb94e9a76808f545ca"

echo "Logging in to get JWT token..."
TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc2RhQGdtYWlsLmNvbSIsImlhdCI6MTc0NDkxMDU2NCwiZXhwIjoxNzQ0OTk2OTY0fQ.TBb8s0QUj9U-vwyxkUYQag3A4AR1RYwR155OS4Lzf6g

echo "Got Token: $TOKEN"
[[ "$TOKEN" == "null" ]] && echo "Login failed" && exit 1

# JWT Header
AUTH_HEADER="Authorization: Bearer $TOKEN"

echo ""
echo "Testing GET /user"
ab -n 100 -c 10 -H "$AUTH_HEADER" "$GATEWAY/user/$USER_ID"

echo ""
echo "Testing POST /habit (create)"
ab -n 100 -c 10 -T "application/json" -H "$AUTH_HEADER" -p create-habit.json "$GATEWAY/habit"

echo ""
echo "Testing GET /habit"
ab -n 100 -c 10 -H "$AUTH_HEADER" "$GATEWAY/habit"

echo ""
echo "Testing POST /user/:id/habit"
ab -n 100 -c 10 -T "application/json" -H "$AUTH_HEADER" -p add-habit.json "$GATEWAY/user/$USER_ID/habit"

echo ""
echo "Testing POST /user/:id/checkHabit"
ab -n 100 -c 10 -T "application/json" -H "$AUTH_HEADER" -p check-habit.json "$GATEWAY/user/$USER_ID/checkHabit"

echo ""
echo "Testing POST /workouts"
ab -n 100 -c 10 -T "application/json" -H "$AUTH_HEADER" -p create-workout.json "$GATEWAY/workouts"

echo ""
echo "Testing GET /workouts"
ab -n 100 -c 10 -H "$AUTH_HEADER" "$GATEWAY/workouts"

echo ""
echo "Testing POST /user/:id/workout"
ab -n 100 -c 10 -T "application/json" -H "$AUTH_HEADER" -p add-workout.json "$GATEWAY/user/$USER_ID/workout"

echo ""
echo "Testing POST /user/:id/checkWorkout"
ab -n 100 -c 10 -T "application/json" -H "$AUTH_HEADER" -p check-workout.json "$GATEWAY/user/$USER_ID/checkWorkout"

echo ""
echo "Done benchmarking all JWT-secured microservices."
