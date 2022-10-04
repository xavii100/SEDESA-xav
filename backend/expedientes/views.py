from django.utils import timezone
from django.template.loader import render_to_string
from django.urls import reverse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


import traceback
import pandas as pd

from config.decorators import validate_token_permission, get_permisos_user
from utils.inc_utils import *
from utils.inc_db import Database
db = Database()


# Obtiene la lista de NotasMedicas


@api_view(['GET'])
# @validate_token_permission()
def get_notaMedica(request):
    contexto = {'listado_notasMedicas': []}

    try:
        sql = """
            SELECT tnota_medica_id, temperatura,
                    frecuencia_cardiaca,
                    frecuencia_respiratoria,
                    saturacion_oxigeno, tension_arterial_sistolica, 
                    tension_arterial_diastolica, peso, altura, fecha_ingreso, tpaciente_nota_id
            FROM medicalrecord.tnota_medica
        """
        df_notasM = db.get_all_pandas(sql, ['%#$%'])
        if not isinstance(df_notasM, bool):
            contexto['listado_notasMedicas'] = df_notasM.to_dict('records')

        elif isinstance(df_notasM, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Notas'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_notaMedica')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)