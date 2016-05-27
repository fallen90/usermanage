@echo off
echo Uninstalling MongoDB Service
mongod -f "F:\mongodb\config\mongodb.conf" --remove --serviceName mdb27017 --serviceDisplayName "MongoDB Server Instance" --serviceDescription "MongoDB Server Instance running on 27017"