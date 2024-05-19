#!/bin/bash

# Import dữ liệu từ attendees.json vào MongoDB
mongoimport --host mongodb --db crud --collection vdt2024 --type json --file /docker-entrypoint-initdb.d/attendees.json --jsonArray
