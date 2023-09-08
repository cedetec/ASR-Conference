#!/bin/bash
echo "Desea re-compilar backend?"
read -p "(y/n) : " action
echo "==============================================================="
if [ "$action" = 'y' ];
then
echo ""
echo "BUILD DE BACKEND CON DOCKER-CONTAINER" 
echo "==========================================="
cp ./docker_files/backend/Dockerfile backend/
cp ./docker_files/backend/build-docker.sh backend/
cd ./backend/
sudo ./build-docker.sh
sudo rm Dockerfile
sudo rm build-docker.sh
cd ..
else
echo "========================= Ok ==========================================================="
fi
echo "========================================================================================"
echo ""
echo "Desea re-compilar frontend?"
read -p "(y/n) : " action
echo "==============================================================="
if [ "$action" = 'y' ];
then
echo "BUILD DE FRONTEND CON DOCKER-CONTAINER" 
echo "============================================"
cp ./docker_files/frontend/Dockerfile frontend/
cp ./docker_files/frontend/build-docker.sh frontend/
cd ./frontend/
sudo ./build-docker.sh
sudo rm Dockerfile
sudo rm build-docker.sh
cd ..
else
echo "=============== TERMINADO ============================="
fi