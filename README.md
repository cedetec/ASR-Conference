# neuta-conference
Asistente traductor de conferencias

## Advertencias
* El programa utiliza los puertos 3000 y 3001 en su ejecucion.
* Si la ejecucion de los scripts da problema aplique el comando dos2unix para dejarlos en formato unix

## Pasos previos
Para ejecutar los programas se deben seguir los siguientes pasos:

1. Descargar los paquetes de idioma de argos-translate en la direccion https://www.argosopentech.com/argospm/index/ .
2. Guardar los paquetes de idioma en una carpeta llamada "old_lang_packs" en la carpeta raiz
3. Ejecute el script "change_names.sh". Esto cambia los nombres de los archivos para poder utilizarlos en el sistema.
4. Descargar los packetes de whisper
5. Guardar los paquetes de whisper en una carpeta llamada "whisper_files"

## Instrucciones para ejecucion
1. Construya los dockers con el script "build-front-back.sh". Se consultara por la construccion del frontend y del backend
2. Ejecute los dockers construidos con el script "re-start-front-back.sh". Se consultara por la ejecucion del frontend y del backend
3. Copie los paquetes de argos con el script "copy-langs-packs.sh"
4. Copie los paquetes de whisper con el script "copy-whisper-to-docker.sh". Se consultara por los modelos que se copiaran

## Programas externos
* Para el uso de un microfono virtual se puede utilizar voicemeeter. Link https://vb-audio.com/Voicemeeter/index.htm