from flask import Flask, request, render_template
from flask_cors import CORS
import os
import whisper
from python_translator import Translator
import time

app = Flask(__name__)
CORS(app)

#model = whisper.load_model('large-v2')
#model = whisper.load_model("base")
model = whisper.load_model("base")

translator = Translator()

cont = 0

audio_data = None

if not os.path.exists("./files/"):
  os.makedirs("./files/")
  
filelist = [ f for f in os.listdir("./files/") ]
for f in filelist:
    os.remove(os.path.join("./files/", f))

print("Servidor listo")

@app.route('/', methods=['POST'])
def process_audio():
    global audio_data
    global cont
    probabilidad = 0.0
    inicio = time.time()
    if 'audio' in request.files:
        audio_blob = request.files['audio']
        print("Audio recibido ")
    fin = time.time()

    print("Tiempo de request: ",fin-inicio)

   
    if audio_blob:
        inicio = time.time()
        audio_path = f"./files/audio_received_{cont}.wav"
        audio_blob.save(audio_path)
        cont = cont + 1
        print(f"El archivo de audio recibido se guardó en {audio_path}")
        fin = time.time()
        print("Tiempo de grabado WAV: ",fin-inicio)
        try:
            inicio = time.time()
            result = model.transcribe(audio_path)#,task ='translate')
            results = ''
            fin = time.time()
            print("Tiempo de Whisper : ",fin-inicio)
            inicio = time.time()
            os.remove(audio_path) #En caso de no querer guardar toda la transcripción es necesario eliminar vacios
            fin = time.time()
            print("Tiempo de eliminacion de WAV : ",fin-inicio) 
            if len( result['segments'][0]) > 0 :
                probabilidad = result['segments'][0]['no_speech_prob']
                if  probabilidad>0.5:
                    #print("STT3: %s",result)
                    print("La probabilidad de no ser voice es:",result['segments'][0]['no_speech_prob'])
                    #print(result['segments'].no_speech_prob)
                    # results = translator.translate(result["text"], "spanish", "english")
                    # print("STT1: %s",result["text"])
                    # print("STT2: %s",results)
                else:
                    print("Probabilidad palabra----------------: ",result["text"])
                    results = result["text"]
                    inicio = time.time()
                    results = translator.translate(result["text"], "spanish", "english")
                    fin = time.time()
                    print("Tiempo de traductor: ",fin-inicio)
       
            return str(results)
        except  Exception as error:
            print(f"El procesamiento del audio fallo en el archivo {audio_path}")
            print(f"Error: {error}")
            return ""
    else:
        return "No se proporcionó ningún archivo de audio"

@app.route('/test')
def test_back():
    return "El programa funciona correctamente"

if __name__ == "__main__":
    app.run(host='0.0.0.0')