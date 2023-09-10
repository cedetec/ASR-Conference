# neuta-conference
Asistente traductor de conferencias

## Advertencias

* El programa utiliza los puertos 3000 y 3001 en su ejecucion.
* Si la ejecucion de los scripts da problema aplique el comando dos2unix para dejarlos en formato unix

## Pasos previos
Para ejecutar los programas se deben seguir los siguientes pasos:

1. Descargar los paquetes de idioma de argos-translate en la direccion https://www.argosopentech.com/argospm/index/ .
2. En el backend cree una carpeta llamada "old_lang_packs".
3. Guarde los paquetes de idioma en la carpeta "old_lang_packs".
4. Ejecute el script "change_names.sh". Esto cambia los nombres de los archivos para poder utilizarlos en el sistema.

## Instrucciones para ejecucion
1. Construya los dockers con el script "build-front-back.sh". Se consultara por la construccion del frontend y del backend
2. Ejecute los dockers construidos con el script "re-start-front-back.sh". Se consultara por la ejecucion del frontend y del backend
