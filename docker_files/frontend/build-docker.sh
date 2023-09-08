#!/bin/bash

sudo docker stop ctr_neuta_conference_frontend
sudo docker rm ctr_neuta_conference_frontend
sudo docker rmi img_neuta_conference_frontend

sudo docker build -t img_neuta_conference_frontend:latest .