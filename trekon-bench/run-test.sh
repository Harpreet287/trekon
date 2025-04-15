#!/bin/bash

echo "Getting JWT token..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/user/login \
-H "Content-Type: application/json" \
-d @login.json | jq -r .token)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Couldn't log in"
  exit 1
fi

echo "Token: $TOKEN"
USER_ID="67fe102c37c7092de433cbd2"
echo ""

# GET /api/user/:id
echo "Testing GET /user"
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
http://localhost:8080/api/user/$USER_ID

# POST /checkHabit
echo "Testing POST /checkHabit"
ab -n 100 -c 10 -T "application/json" \
-H "Authorization: Bearer $TOKEN" \
-p checkHabit.json \
http://localhost:8080/api/user/$USER_ID/checkHabit

# POST /checkWorkout
echo "Testing POST /checkWorkout"
ab -n 100 -c 10 -T "application/json" \
-H "Authorization: Bearer $TOKEN" \
-p checkWorkout.json \
http://localhost:8080/api/user/$USER_ID/checkWorkout

# GET /user/:id/habit
echo "Testing GET /user/:id/habit"
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
http://localhost:8080/api/user/$USER_ID/habit

# GET /user/:id/workout
echo "Testing GET /user/:id/workout"
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
http://localhost:8080/api/user/$USER_ID/workout

# POST /user/:id/habit (add habit)
echo "Testing POST /user/:id/habit"
ab -n 100 -c 10 -T "application/json" \
-H "Authorization: Bearer $TOKEN" \
-p checkHabit.json \
http://localhost:8080/api/user/$USER_ID/habit

# POST /user/:id/workout (add workout)
echo "Testing POST /user/:id/workout"
ab -n 100 -c 10 -T "application/json" \
-H "Authorization: Bearer $TOKEN" \
-p checkWorkout.json \
http://localhost:8080/api/user/$USER_ID/workout

# GET /habit (global habits)
echo "Testing GET /habit"
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/habit

# POST /habit (global habit create)
echo "Testing POST /habit"
ab -n 100 -c 10 -T "application/json" \
-H "Authorization: Bearer $TOKEN" \
-p createHabit.json \
http://localhost:8080/api/habit

echo "ALL FUNCTIONAL ENDPOINTS TESTED"
