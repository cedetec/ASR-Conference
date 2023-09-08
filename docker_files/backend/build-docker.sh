#!/bin/bash

sudo docker stop ctr_neuta_conference_backend
sudo docker rm ctr_neuta_conference_backend
sudo docker rmi img_neuta_conference_backend

sudo docker build -t img_neuta_conference_backend:latest .