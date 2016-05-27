@echo off
echo Installing MongoDB Service
mongod -f "F:\mongodb\config\mongodb.conf" --install --serviceName mdb27017 --serviceDisplayName "MongoDB Server Instance" --serviceDescription "MongoDB Server Instance running on 27017"