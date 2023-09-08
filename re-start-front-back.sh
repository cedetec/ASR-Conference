#!/bin/bash
sudo docker stop ctr_neuta_conference_backend
sudo docker rm ctr_neuta_conference_backend
sudo docker run -p 3000:3000 --restart=on-failure:10 --name ctr_neuta_conference_backend -d img_neuta_conference_backend

sudo docker stop ctr_neuta_conference_frontend
sudo docker rm ctr_neuta_conference_frontend
sudo docker run -p 3001:3001 --restart=on-failure:10 --name ctr_neuta_conference_frontend -d img_neuta_conference_frontend 
