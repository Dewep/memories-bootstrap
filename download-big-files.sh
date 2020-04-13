#!/bin/bash

set -e

AUTHENTICATION_HEADER="Basic XXXXXXXXXXXXXXXXXXXXXXX"

FILES=(
    "medias/2020/02-20-hashcode/big-file.mp4"
)

for file in "${FILES[@]}"
do
    if [ ! -f "$file" ]; then
        wget --header="Authorization: ${AUTHENTICATION_HEADER}" "https://memories.com/$file" -O "$file"
    fi
done
