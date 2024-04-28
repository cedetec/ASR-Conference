FROM nvidia/cuda:11.7.1-cudnn8-devel-ubuntu22.04

RUN apt-get update && \
    apt-get install -y --no-install-recommends


WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    curl \
    cmake \
    git \
    g++ \
    ffmpeg \
    python3 \
    python3-pip \
    python3.10-venv \
    libssl-dev \
    libc-dev \
    python3-dev

RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install wheel
RUN pip install bs4
RUN pip install flask
RUN pip install flask_cors
#RUN pip install python_translator
RUN pip install argostranslate==1.9.0
RUN pip install setuptools-rust

RUN pip install cuda-python
#RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip3 install  torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118/
#RUN pip install -U openai-whisper
RUN pip install uwsgi
RUN pip install -U faster_whisper

#RUN whisper --model tiny dummy.wav; exit 0
#RUN whisper --model base dummy.wav; exit 0
#RUN whisper --model small dummy.wav; exit 0
#RUN whisper --model medium dummy.wav; exit 0
#RUN whisper --model large dummy.wav; exit 0
#RUN whisper --model large-v2 dummy.wav; exit 0

#RUN wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-keyring_1.1-1_all.deb
#RUN dpkg -i cuda-keyring_1.1-1_all.deb
#RUN apt-get update
#RUN apt-get -y install cuda




#FROM pytorch/pytorch:latest


# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#         cuda-libraries-11-8 \
#         cuda-nvrtc-11-8\
#         cuda-nvcc-11-0 \
#         cuda-cudart-11-0 \
#         libcudnn8=8.0.4.30-1+cuda11.0 \
#         libcudnn8-dev=8.0.4.30-1+cuda11.0 && \
#     rm -rf /var/lib/apt/lists/*

#apt-get install libcudnn8=8.9.4.*+cuda11.8  
#apt-get install libcudnn8-dev=8.9.4.*+cuda11.8  
#apt-get install libcudnn8=8.9.4.*+cuda11.8  

# $ curl https://developer.download.nvidia.com/hpc-sdk/ubuntu/DEB-GPG-KEY-NVIDIA-HPC-SDK | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-hpcsdk-archive-keyring.gpg
# $ echo 'deb [signed-by=/usr/share/keyrings/nvidia-hpcsdk-archive-keyring.gpg] https://developer.download.nvidia.com/hpc-sdk/ubuntu/amd64 /' | sudo tee /etc/apt/sources.list.d/nvhpc.list
# $ sudo apt-get update -y
# $ sudo apt-get install -y nvhpc-23-7-cuda-multi

RUN apt-get update && apt-get install -y \
    bash \
    nano \
    curl

COPY . .

#ADD ../lang_packs/ /app/

#COPY ../whisper_files/models--guillaumekln--faster-whisper-tiny/ /root/.cache/huggingface/hub/
#COPY ../whisper_files/models--guillaumekln--faster-whisper-base/ /root/.cache/huggingface/hub/
#COPY ../whisper_files/models--guillaumekln--faster-whisper-small/ /root/.cache/huggingface/hub/
#COPY ../whisper_files/models--guillaumekln--faster-whisper-medium/ /root/.cache/huggingface/hub/
#COPY ../whisper_files/models--guillaumekln--faster-whisper-large-v2/ /root/.cache/huggingface/hub/

EXPOSE 3000

CMD ["uwsgi", "--socket", "0.0.0.0:3000", "--protocol=http", "-w", "wsgi:app"]