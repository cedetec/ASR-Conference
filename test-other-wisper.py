# pip install ctranslate2 para traslacion

import time
from faster_whisper import WhisperModel
from python_translator import Translator

translator = Translator()
#model_size = "large-v2"
model_size = "small"


# Run on GPU with FP16
#model = WhisperModel(model_size, device="cuda", compute_type="float16")

# or run on GPU with INT8
#model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
inicio = time.time()
model = WhisperModel(model_size, device="cpu", compute_type="int8")
fin = time.time()
print(fin-inicio)
inicio = time.time()
#segments, info = model.transcribe("audio.mp3", beam_size=10,task ='translate')
segments, info = model.transcribe("audio.mp3")#, beam_size=10)
fin = time.time()
print(fin-inicio)
inicio = time.time()
print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

fin = time.time()
print(fin-inicio)

inicio = time.time()
for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))    
    results = translator.translate(segment.text, "spanish")
    print("Traduccion: %s" % (results))
fin = time.time()
print(fin-inicio)

print("Probando --- ")

for segment2 in segments:
    results = translator.translate(segment2.text, "portuguese")
    print("Traduccion:%s" % (results))
