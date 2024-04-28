#!/bin/bash

# Ruta al directorio que contiene los archivos
old_dir="./old_lang_packs"
new_dir="./lang_packs"

# Iteramos sobre los archivos en el directorio
for archivo in "$old_dir"/*-*.argosmodel; do
    if [ -f "$archivo" ]; then
        # Obtener el nombre base del archivo sin la extensión
        nombre_base=$(basename "$archivo" ".argosmodel")

        # Obtener la parte del nombre que deseas mantener
        nuevo_nombre=$(echo "$nombre_base" | sed 's/-[0-9]\+\(_[0-9]\+\)\?//')

        # Renombrar el archivo
        mv "$archivo" "$new_dir/$nuevo_nombre.argosmodel"
        echo "Archivo renombrado: $archivo -> $nuevo_nombre.argosmodel"
    fi
done