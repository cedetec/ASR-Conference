#!/bin/bash

echo "Creando carpeta para los archivos"
sudo docker exec ctr_neuta_conference_backend mkdir /root/.cache/huggingface/
sudo docker exec ctr_neuta_conference_backend mkdir /root/.cache/huggingface/hub/

echo "Desea copiar el modelo tiny?"
read -p "(y/n) : " action
echo "==============================================================="
if [ "$action" = 'y' ];
then
sudo docker cp ./whisper_files/models--guillaumekln--faster-whisper-tiny ctr_neuta_conference_backend:/root/.cache/huggingface/hub/
else
echo "========================= Ok ==========================================================="
fi

echo "Desea copiar el modelo base?"
read -p "(y/n) : " action
echo "==============================================================="
if [ "$action" = 'y' ];
then
sudo docker cp ./whisper_files/models--guillaumekln--faster-whisper-base ctr_neuta_conference_backend:/root/.cache/huggingface/hub/
else
echo "========================= Ok ==========================================================="
fi

echo "Desea copiar el modelo small?"
read -p "(y/n) : " action
echo "==============================================================="
if [ "$action" = 'y' ];
then
sudo docker cp ./whisper_files/models--guillaumekln--faster-whisper-small ctr_neuta_conference_backend:/root/.cache/huggingface/hub/
else
echo "========================= Ok ==========================================================="
fi

echo "Desea copiar el modelo medium?"
read -p "(y/n) : " action
echo "==============================================================="
if [ "$action" = 'y' ];
then
sudo docker cp ./whisper_files/models--guillaumekln--faster-whisper-medium ctr_neuta_conference_backend:/root/.cache/huggingface/hub/
else
echo "========================= Ok ==========================================================="
fi

echo "Desea copiar el modelo large?"
read -p "(y/n) : " action
echo "==============================================================="
if [ "$action" = 'y' ];
then
sudo docker cp ./whisper_files/models--guillaumekln--faster-whisper-large-v2 ctr_neuta_conference_backend:/root/.cache/huggingface/hub/
else
echo "========================= Ok ==========================================================="
fi

echo "=============== TERMINADO ============================="