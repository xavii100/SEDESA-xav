from django.shortcuts import render
from django.utils import timezone

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import traceback
import pandas as pd
import numpy as np

from users.models import *

from utils.inc_utils import *
from utils.inc_db import Database
db = Database()


######### CRUD Bitácora #########

# Obtiene la lista de la bitácora del ETL
'''
/catalogos/get_bitacora/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "tetl_reporte_historico_id" : "id_etl",
        "fecha" : "fecha_etl",
        "tipo" : "tipo_archivo",
        "log" : "nombre_archivo",
        "estatus" : "estatus del archivo",
        "nombre_usuario" : "nombre_usuario_carga"

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
def get_bitacora(request):
    contexto = {}
    try:
        sql = """
            SELECT
                r.tetl_reporte_historico_id, r.tipo, r.fecha, r.reporte
                log, r.estatus, r.tusuario_id, 
                CONCAT_WS(' ', u.nombre, u.apellido_paterno, u.apellido_materno) as nombre_usuario
            FROM dashboards.tetl_reporte_historico as r
            JOIN public.usuario as  u
            ON  r.tusuario_id=u.tusuario_id
            ORDER BY tetl_reporte_historico_id DESC
        """
        bitacora = db.get_all_pandas(sql)
        if not isinstance(bitacora, bool):
            bitacora = pd.DataFrame(bitacora).replace({np.nan:None})
            bitacora = bitacora.to_dict('records')
        elif isinstance(bitacora, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos en la bitácora'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['bitacora'] = bitacora
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_bitacora')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



