from flask import Flask, request, render_template
from flask_cors import CORS
import os
#import whisper
from faster_whisper import WhisperModel
from python_translator import Translator
import time

app = Flask(__name__)
CORS(app)

#model = whisper.load_model('large-v2')
#model = whisper.load_model("base") small

#model = whisper.load_model("base")

model_size = "small"

model = WhisperModel(model_size, device="cpu", compute_type="int8")

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
    results = ''
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
            #segments, info = model.transcribe("audio.mp3", beam_size=10,task ='translate')
            segments, info = model.transcribe(audio_path,no_speech_threshold=0.5,vad_filter=True,vad_parameters=dict(min_silence_duration_ms=500, speech_pad_ms=200))#, beam_size=10)
            fin = time.time()
            print("Tiempo de Fast-Wisper",fin-inicio)
            #print("_________________________",segments[0])
            #print("_________________________")
            inicio = time.time()
            print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

            fin = time.time()
            print("Tiempo de deteccion idioma",fin-inicio)

            inicio = time.time()

            for segment in segments:
                print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))    
                results = results + ' ' +translator.translate(segment.text, "spanish")
                print("Traduccion: %s" % (results))
            fin = time.time()
            print(fin-inicio)
            print("STT3: %s",results)
                
            
       
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