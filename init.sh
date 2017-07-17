#!/bin/sh
cd client/
yarn
cd ../
cd server/
yarn
mkdir -p mongodb-data/db
