#!/bin/bash

echo "Exportando variables -$1-"
set -a; source ./enviroment.env;  set +a;

echo "Ejecutando $@"
$@