from flask import Flask, request, jsonify
from flask_cors import CORS
import os
#import whisper
from faster_whisper import WhisperModel
#from python_translator import Translator
from argostranslate import package
import argostranslate.translate
from variables import Langs, models
import time
app = Flask(__name__)
CORS(app)


LangEntrada = ""
LangSalida = ""

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
    results_texto = ''
    if 'audio' in request.files:
        audio_blob = request.files['audio']

    if audio_blob:
        audio_path = f"./files/audio_received_{cont}.wav"
        audio_blob.save(audio_path)
        cont = cont + 1

        try:
            #result = model.transcribe(audio_path, language=LangEntrada)
            inicio0 = time.time()
            if (str(LangEntrada) == "es"):
       #segments, info = model.transcribe("audio.mp3", beam_size=10,task ='translate')
                inicio = time.time()
                segments, info = model.transcribe(audio_path,no_speech_threshold=0.5,vad_filter=True,vad_parameters=dict(min_silence_duration_ms=500, speech_pad_ms=200))#, beam_size=10)
                fin = time.time()
                print("Tiempo de Fast-Wisper",fin-inicio)
                inicio = time.time()
                print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
                fin = time.time()
                print("Tiempo de deteccion idioma",fin-inicio)
                inicio = time.time()
                for segment in segments:
                    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))    
                  #  results = results + ' ' + str(argostranslate.translate.translate(segment.text, "en", LangSalida))
                    results_texto = results_texto + ' ' + str(segment.text)
                    print("Traduccion: %s" % (results))
                fin = time.time()
                print(fin-inicio)
                results = results_texto
                print("STT3: %s",results)
            else:

                inicio = time.time()
                    #segments, info = model.transcribe("audio.mp3", beam_size=10,task ='translate')
                segments, info = model.transcribe(audio_path,task ="translate",no_speech_threshold=0.5,vad_filter=True,vad_parameters=dict(min_silence_duration_ms=500, speech_pad_ms=200))#, beam_size=10)
                fin = time.time()
                print("Tiempo de Fast-Wisper",fin-inicio)
                inicio = time.time()
                print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
                fin = time.time()
                print("Tiempo de deteccion idioma",fin-inicio)
                inicio = time.time()
                for segment in segments:
                    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))    
                    results = results + ' ' + str(argostranslate.translate.translate(segment.text, "en", LangSalida))
                    results_texto = results_texto + ' ' + str(segment.text)

                    print("Traduccion: %s" % (results))
                fin = time.time()
                print(fin-inicio)
                print("STT3: %s",results)
                print("STT4---: %s",results_texto)
                print("STT5---: %s",str(argostranslate.translate.translate(results_texto, "en", LangSalida)))
                fin = time.time()
                print(f"Tiempo de ejecucion en procesamiento global es: {fin - inicio0}")
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

@app.route('/get_data', methods=['GET'])
def send_data():
    lang_min = list(Langs.keys())
    lang = list(Langs.values())
    lang_es = []

    for sublista in lang:
        lang_es.append(sublista[1])
    
    return jsonify({"lang": lang_es, "lang_min": lang_min, "models": models})

@app.route('/start', methods=['POST'])
def start_app():
    global model
    global translate_model
    global audio_data
    global cont
    global LangEntrada
    global LangSalida

    cont = 0
    audio_data = None
        
    modelo = request.form.get('Modelo')
    LangEntrada = request.form.get('LangEntrada')
    LangSalida = request.form.get('LangSalida')

    if modelo and LangEntrada and LangSalida:
        try:
          #  model = whisper.load_model(modelo)
           # model = WhisperModel(modelo, device="cpu", compute_type="int8")
            model = WhisperModel(modelo, device="cuda", compute_type="float16")

            if (str(LangEntrada) != "en"):
                package.install_from_path(f'./lang_packs/translate-{LangEntrada}_en.argosmodel')

            if (str(LangSalida) != "en"):
                package.install_from_path(f'./lang_packs/translate-en_{LangSalida}.argosmodel')

        except Exception as error:
            print(f"Error: {error}")
            return jsonify({"error": "El modelo de audio no cargo correctamente"}), 400
            
        return jsonify({"message": "Solicitud recibida correctamente"}), 200
    else:
        return jsonify({"error": "Faltan entradas de texto"}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0')