#!/bin/bash

echo "Desea iniciar el backend?"
read -p "(y/n) : " action
if [ "$action" = 'y' ];
then
sudo docker stop ctr_neuta_conference_backend
sudo docker rm ctr_neuta_conference_backend
sudo docker run  -it --gpus all -p 3000:3000 --restart=on-failure:10 --name ctr_neuta_conference_backend -d img_neuta_conference_backend
else
echo "========================= Ok ==========================================================="
fi

echo "Desea iniciar el frontend?"
read -p "(y/n) : " action
if [ "$action" = 'y' ];
then
sudo docker stop ctr_neuta_conference_frontend
sudo docker rm ctr_neuta_conference_frontend
sudo docker run -p 3001:3001 --restart=on-failure:10 --name ctr_neuta_conference_frontend -d img_neuta_conference_frontend 
else
echo "========================= Ok ==========================================================="
fi
