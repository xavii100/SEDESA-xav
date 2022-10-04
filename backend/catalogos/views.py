from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict

from config.decorators import validate_token_permission
from users.models import *
from catalogos.serializers import *

import pandas as pd
import numpy as np
import traceback

from utils.inc_utils import *
from utils.inc_db import Database
db = Database()


######### CRUD Hospital #########

# Obtiene la lista de Hospitales
'''
/catalogos/get_hospitales/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "hospitales": [
            lista de diccionarios {"thospital_id","nombre","nombre_corto","direccion","atiende_covid19","clues","cp" }
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_hospital', acciones_a_validar=['listar'])
def get_hospitales(request):
    contexto = {}
    try:
        sql = """
            SELECT
                thospital_id, nombre, nombre_corto, direccion, atiende_covid19, clues, cp
            FROM "general".thospital
            ORDER BY thospital_id DESC
        """
        hospitales = db.get_all_pandas(sql)
        if not isinstance(hospitales, bool):
            hospitales = pd.DataFrame(hospitales).replace({np.nan:None})
            hospitales = hospitales.to_dict('records')
        elif isinstance(hospitales, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Hospitales'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['hospitales'] = hospitales
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_hospitales')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Agrega o edita un hospital
'''
/catalogos/set_hospital/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre hospital",
        "nombre_corto" : "nombre corto de hospital",
        "direccion" : "direccion hospital",
        "atiende_covid19" : "True/False",
        "clues" : "clues",
        "cp" : "cp", 
        "hospital_id" : "id" #opcional para editar hospital
    }
Datos enviados por el BACK
    {
        # status 201
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_hospital', acciones_a_validar=['crear','editar'])
def set_hospital(request):
    contexto = {'error': ""}
    try:
        h = None
        if 'hospital_id' in request.data:
            try:
                h = Thospital.objects.get(thospital_id = request.data.get('hospital_id'))

                hospital_serializer = HospitalSerializer(h, data=request.data, context=request.data)
                if hospital_serializer.is_valid():
                    hospital_serializer.save()
                    return Response(hospital_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in hospital_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)  

            except Thospital.DoesNotExist:
                contexto['error'] = 'El hospital a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not h:
            hospital_serializer = HospitalSerializer(data=request.data, context=request.data)
            if hospital_serializer.is_valid():
                hospital_serializer.save()
                return Response(hospital_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in hospital_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_hospital')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de un Hospital
'''
/catalogos/get_hospital/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "hospital_id" : "id" # esto es para ver información de un hospital específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            "thospital_id", "nombre", "nombre_corto",
            "direccion", "atiende_covid19", "clues", "cp"
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_hospital', acciones_a_validar=['editar'])
def get_hospital(request):
    contexto = {}
    try:
        h = Thospital.objects.get(thospital_id = request.data.get('hospital_id'))
        contexto['data'] = model_to_dict(h)
        return Response(contexto, status=status.HTTP_200_OK)

    except Thospital.DoesNotExist:
        contexto['error'] = 'No existe el hospital'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_hospital')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD Síntoma #########

# Obtiene la lista de Síntomas
'''
/catalogos/get_sintomas/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "sintomas": [
            lista de diccionarios {"csintoma_id", "nombre", "abreviatura", "principal" }
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_sintomas', acciones_a_validar=['listar'])
def get_sintomas(request):
    contexto = {}
    try:
        sql = """
            SELECT csintoma_id, nombre, abreviatura, principal
            FROM triage.csintoma
            ORDER BY csintoma_id DESC
        """
        sintomas = db.get_all_pandas(sql)
        if not isinstance(sintomas, bool):
            sintomas = pd.DataFrame(sintomas).replace({np.nan:None})
            sintomas = sintomas.to_dict('records')
        elif isinstance(sintomas, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Síntomas'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['sintomas'] = sintomas
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_sintomas')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Inserta/Edita un Síntoma
'''
/catalogos/set_sintomas/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre del síntoma",
        "abreviatura" : "abreviatura del síntoma",
        "principal" : "True/False"
        # opcional
        "sintoma_id" = csintoma_id # esto es para editar un síntoma específico, sino se coloca, lo inserta
    }
Datos enviados por el BACK
    {
        # status 201
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_sintomas', acciones_a_validar=['crear','editar'])
def set_sintoma(request):
    contexto = {'error': ""}
    try:
        s = None
        if 'sintoma_id' in request.data:
            try:
                s = Csintoma.objects.get(csintoma_id = request.data.get('sintoma_id'))

                sintoma_serializer = SintomaSerializer(s, data=request.data, context=request.data)
                if sintoma_serializer.is_valid():
                    sintoma_serializer.save()
                    return Response(sintoma_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in sintoma_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except Csintoma.DoesNotExist:
                contexto['error'] = 'El síntoma a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not s:
            sintoma_serializer = SintomaSerializer(data=request.data, context=request.data)
            if sintoma_serializer.is_valid():
                sintoma_serializer.save()
                return Response(sintoma_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in sintoma_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:       
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_sintoma')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de un Síntoma
'''
/catalogos/get_sintoma/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "sintoma_id" : "id" # esto es para ver información de un síntoma específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {"csintoma_id", "nombre", "abreviatura", "principal" }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_sintomas', acciones_a_validar=['editar'])
def get_sintoma(request):
    contexto = {}
    try:
        s = Csintoma.objects.get(csintoma_id = request.data.get('sintoma_id'))
        contexto['data'] = model_to_dict(s)
        return Response(contexto, status=status.HTTP_200_OK)

    except Csintoma.DoesNotExist:
        contexto['error'] = 'No existe el síntoma'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_sintoma')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD Constante Vital #########

# Obtiene la lista de Constante Vital
'''
/catalogos/get_constantes_vitales/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "constantes_vitales": [
            lista de diccionarios {"cconstante_vital_id","nombre","abreviatura","min","max","alerta_menor_que","alerta_mayor_que" }
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_constantes_vitales', acciones_a_validar=['listar'])
def get_constantes_vitales(request):
    contexto = {}
    try:
        sql = """
            SELECT
                cconstante_vital_id, nombre, abreviatura, min, max,
                alerta_menor_que, alerta_mayor_que
            FROM triage.cconstante_vital
            ORDER BY cconstante_vital_id DESC
        """
        constantes_vitales = db.get_all_pandas(sql)
        if not isinstance(constantes_vitales, bool):
            constantes_vitales = pd.DataFrame(constantes_vitales).replace({np.nan:None})
            constantes_vitales = constantes_vitales.to_dict('records')
        elif isinstance(constantes_vitales, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Constantes Vitales'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['constantes_vitales'] = constantes_vitales
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_constantes_vitales')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Inserta/Edita una Constante Vital
'''
/catalogos/set_constante_vital/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre de la constante vital",
        "abreviatura" : "abreviatura de la constante vital",
        "min" : "min",
        "max" : "max",
        "alerta_menor_que" : "alerta_menor_que",
        "alerta_mayor_que" : "alerta_mayor_que",
        # opcional
        "constante_vital_id" = cconstante_vital_id # esto es para editar una constante específico, sino se coloca, lo inserta
    }
Datos enviados por el BACK
    {
        # status 200
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_constantes_vitales', acciones_a_validar=['crear','editar'])
def set_constante_vital(request):
    contexto = {'error': ""}
    try:
        c = None
        if 'constante_vital_id' in request.data:
            try:
                c = CconstanteVital.objects.get(cconstante_vital_id = request.data.get('constante_vital_id'))

                constante_serializer = ConstanteVitalSerializer(c, data=request.data, context=request.data)
                if constante_serializer.is_valid():
                    constante_serializer.save()
                    return Response(constante_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in constante_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except CconstanteVital.DoesNotExist:
                contexto['error'] = 'La constante vital a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not c:
            constante_serializer = ConstanteVitalSerializer(data=request.data, context=request.data)
            if constante_serializer.is_valid():
                constante_serializer.save()
                return Response(constante_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in constante_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:       
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_constante_vital')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de una Constante Vital
'''
/catalogos/get_constante_vital/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "constante_vital_id" : "id" # esto es para ver información de una constante vital específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            "cconstante_vital_id", "nombre", "abreviatura",
            "min", "max", "alerta_menor_que", "alerta_mayor_que"
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_constantes_vitales', acciones_a_validar=['editar'])
def get_constante_vital(request):
    contexto = {}
    try:
        c = CconstanteVital.objects.get(cconstante_vital_id = request.data.get('constante_vital_id'))
        contexto['data'] = model_to_dict(c)
        return Response(contexto, status=status.HTTP_200_OK)

    except CconstanteVital.DoesNotExist:
        contexto['error'] = 'No existe la constante vital'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_constante_vital')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD Antecedentes #########

# Obtiene la lista de Antecedentes
'''
/catalogos/get_antecedentes/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "antecedentes": [
            lista de diccionarios {"cantecedente_id","cantecedente_primario_id","nombre","abreviatura","sinonimos","triage" }
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_antecedentes', acciones_a_validar=['listar'])
def get_antecedentes(request):
    contexto = {}
    try:
        sql = """
            SELECT
                cantecedente_id, cantecedente_primario_id, nombre, abreviatura, sinonimos, triage
            FROM triage.cantecedente
            ORDER BY cantecedente_id DESC
        """
        antecedentes = db.get_all_pandas(sql)
        if not isinstance(antecedentes, bool):
            antecedentes = pd.DataFrame(antecedentes).replace({np.nan:None})
            antecedentes = antecedentes.to_dict('records')
        elif isinstance(antecedentes, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Antecedentes'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        # for r in antecedentes:
            # x = r['cantecedente_primario_id']
            # r['cantecedente_primario_id'] = None if (np.isnan(x) if (type(x) == float or type(x) == np.float64) else False) else x
            # if r['sinonimos'] != None:
            #     r['sinonimos'] = r['sinonimos'].split(',')

        contexto['antecedentes'] = antecedentes
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_antecedentes')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Inserta/Edita un antecedente
'''
/catalogos/set_antecedente/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre del antecedente",
        "abreviatura" : "abreviatura del antecedente",
        "sinonimos" : "sinonimos del antecedente",
        "triage" : "T/F",
        # opcional
        "antecedente_id" = cantecedente_id # esto es para editar un antecedente específico, sino se coloca, lo inserta
        "cantecedente_primario" : cantecedente_primario_id # solo en caso de que sea un antecedente primario para otros
    }
Datos enviados por el BACK
    {
        # status 200
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
#@validate_token_permission(url='c_antecedentes', acciones_a_validar=['crear','editar'])
def set_antecedente(request):
    contexto = {'error': ""}
    try:
        a = None
        if 'antecedente_id' in request.data:
            try:
                a = Cantecedente.objects.get(cantecedente_id = request.data.get('antecedente_id'))

                antecedente_serializer = AntecedenteSerializer(a, data=request.data, context=request.data)
                if antecedente_serializer.is_valid():
                    antecedente_serializer.save()
                    return Response(antecedente_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in antecedente_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except Cantecedente.DoesNotExist:
                contexto['error'] = 'El antecedente a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not a:
            antecedente_serializer = AntecedenteSerializer(data=request.data, context=request.data)
            if antecedente_serializer.is_valid():
                antecedente_serializer.save()
                return Response(antecedente_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in antecedente_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:       
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_antecedente')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de un Antecedente
'''
/catalogos/get_antecedente/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "antecedente_id" : "id" # esto es para ver información de un Antecedente específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {"cantecedente_id","cantecedente_primario_id","nombre","abreviatura","sinonimos","triage" }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_antecedentes', acciones_a_validar=['editar'])
def get_antecedente(request):
    contexto = {}
    try:
        a = Cantecedente.objects.get(cantecedente_id = request.data.get('antecedente_id'))
        contexto['data'] = model_to_dict(a)
        return Response(contexto, status=status.HTTP_200_OK)

    except Cantecedente.DoesNotExist:
        contexto['error'] = 'No existe el antecedente'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_antecedente')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD Especialidades #########

# Obtiene la lista de Especialidades
'''
/catalogos/get_especialidades/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "especialidades": [
            lista de diccionarios {"cespecialidad_tipo_id","nombre","agrupar_en_otras" }
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_especialidad', acciones_a_validar=['listar'])
def get_especialidades(request):
    contexto = {}
    try:
        sql = """
            SELECT cespecialidad_tipo_id, nombre, agrupar_en_otras
            FROM dashboards.cespecialidad_tipo
            ORDER BY cespecialidad_tipo_id DESC
        """
        especialidades = db.get_all_pandas(sql)
        if not isinstance(especialidades, bool):
            especialidades = pd.DataFrame(especialidades).replace({np.nan:None})
            especialidades = especialidades.to_dict('records')
        elif isinstance(especialidades, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Especialidades'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['especialidades'] = especialidades
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_especialidades')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Inserta/Edita una especialidad
'''
/catalogos/set_especialidad/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre de la especialidad",
        "agrupar_en_otras" : "T/F",
        # opcional
        "especialidad_id" = cespecialidad_tipo_id # esto es para editar una especialidad específica, sino se coloca, lo inserta
    }
Datos enviados por el BACK
    {
        # status 200
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_especialidad', acciones_a_validar=['crear','editar'])
def set_especialidad(request):
    contexto = {'error': ""}
    try:
        e = None
        if 'especialidad_id' in request.data:
            try:
                e = CespecialidadTipo.objects.get(cespecialidad_tipo_id = request.data.get('especialidad_id'))

                especialidad_serializer = EspecialidadTipoSerializer(e, data=request.data, context=request.data)
                if especialidad_serializer.is_valid():
                    especialidad_serializer.save()
                    return Response(especialidad_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in especialidad_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except CespecialidadTipo.DoesNotExist:
                contexto['error'] = 'La especialidad a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not e:
            especialidad_serializer = EspecialidadTipoSerializer(data=request.data, context=request.data)
            if especialidad_serializer.is_valid():
                especialidad_serializer.save()
                return Response(especialidad_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in especialidad_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:       
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_especialidad')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de una Especialidad
'''
/catalogos/get_especialidad/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "especialidad_tipo_id" : "id" # esto es para ver información de una Especialidad específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {"cespecialidad_tipo_id","nombre","agrupar_en_otras" }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_especialidad', acciones_a_validar=['editar'])
def get_especialidad(request):
    contexto = {}
    try:
        e = CespecialidadTipo.objects.get(cespecialidad_tipo_id = request.data.get('especialidad_tipo_id'))
        contexto['data'] = model_to_dict(e)
        return Response(contexto, status=status.HTTP_200_OK)

    except CespecialidadTipo.DoesNotExist:
        contexto['error'] = 'No existe la especialidad'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_especialidad')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD Estado Alerta #########

# Obtiene la lista de Estados Alertas
'''
/catalogos/get_estados_alertas/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "estado_alerta": [
            lista de diccionarios {"cestado_alerta_id", "nombre", "abreviatura", "opciones": {"cestado_alerta_opcion_id","nombre"} }
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
#@validate_token_permission(url='c_estado_alerta', acciones_a_validar=['listar'])
def get_estados_alertas(request):
    contexto = {}
    try:
        sql = """
            SELECT cestado_alerta_id, nombre, abreviatura
            FROM triage.cestado_alerta
            ORDER BY cestado_alerta_id DESC
        """
        estados_alerta = db.get_all_pandas(sql)
        if not isinstance(estados_alerta, bool):
            estados_alerta = pd.DataFrame(estados_alerta).replace({np.nan:None})
            estados_alerta['opciones'] = [[]] * estados_alerta.shape[0]
            estados_alerta = estados_alerta.to_dict('records')
        elif isinstance(estados_alerta, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Estados de Alerta'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        sql = "SELECT cestado_alerta_opcion_id, nombre, estado_alerta_id FROM triage.cestado_alerta_opcion"
        estados_alerta_op = db.get_all_pandas(sql)
        if isinstance(estados_alerta_op, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Estados de Alerta de Opinión'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not estados_alerta_op.empty:
            estados_alerta_op = pd.DataFrame(estados_alerta_op).replace({np.nan:None})
            for e in estados_alerta:
                e['opciones'] = estados_alerta_op[estados_alerta_op['estado_alerta_id'] == e['cestado_alerta_id']][['cestado_alerta_opcion_id', 'nombre']].to_dict('records')

        contexto['estado_alerta'] = estados_alerta
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_estados_alertas')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Inserta/Edita un Estado de alerta
'''
/catalogos/set_estado_alerta/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre del estado de alerta",
        "abreviatura" : "abreviatura del estado de alerta",
        # opcional
        "estado_alerta_id" = cestado_alerta_id # esto es para editar un estado específico, sino se coloca, lo inserta,
        "opciones" : [opcion1,opcion2,opcion_n]
    }
Datos enviados por el BACK
    {
        # status 200
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
#@validate_token_permission(url='c_estado_alerta', acciones_a_validar=['crear','editar'])
def set_estado_alerta(request):
    contexto = {'error': ""}
    try:
        e = None
        if 'estado_alerta_id' in request.data:
            try:
                e = CestadoAlerta.objects.get(cestado_alerta_id = request.data.get('estado_alerta_id'))

                estado_serializer = EstadoAlertaSerializer(e, data=request.data, context=request.data)
                if estado_serializer.is_valid():
                    est = estado_serializer.save()
                    if (request.data.get('opciones') and request.data['opciones'] and isinstance(request.data['opciones'], list) \
                    and len(request.data['opciones'])>0
                    ):
                        elementos = CestadoAlertaOpcion.objects.filter(estado_alerta_id = request.data.get('estado_alerta_id'))
                        elementos.delete()
                        opciones_estados = set(request.data['opciones'])
                        for opcion_nombre in opciones_estados:
                            rg_opcion_estado = CestadoAlertaOpcion()
                            rg_opcion_estado.nombre = opcion_nombre 
                            rg_opcion_estado.estado_alerta = est
                            rg_opcion_estado.save()
                    return Response(estado_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in estado_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except CestadoAlerta.DoesNotExist:
                contexto['error'] = 'El estado de alerta a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not e:
            estado_serializer = EstadoAlertaSerializer(data=request.data, context=request.data)
            if estado_serializer.is_valid():
                est = estado_serializer.save()
                if (request.data.get('opciones') and request.data['opciones'] and isinstance(request.data['opciones'], list) \
                and len(request.data['opciones'])>0
                ):
                    opciones_estados = set(request.data['opciones'])
                    for opcion_nombre in opciones_estados:
                        rg_opcion_estado = CestadoAlertaOpcion()
                        rg_opcion_estado.nombre = opcion_nombre 
                        rg_opcion_estado.estado_alerta = est
                        rg_opcion_estado.save()
 
                return Response(estado_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in estado_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:       
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_estado_alerta')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de un Estado Alerta
'''
/catalogos/get_estado_alerta/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "estado_alerta_id" : "id" # esto es para ver información de un Estado Alerta específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            "cestado_alerta_id",
            "nombre",
            "abreviatura",
            "opciones": [ {"cestado_alerta_opcion_id","nombre"} ]
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_estado_alerta', acciones_a_validar=['editar'])
def get_estado_alerta(request):
    contexto = {}
    try:
        ea = CestadoAlerta.objects.get(cestado_alerta_id = request.data.get('estado_alerta_id'))
        contexto['data'] = model_to_dict(ea)
        opciones = CestadoAlertaOpcion.objects.filter(estado_alerta=ea).values(
            'cestado_alerta_opcion_id', 'nombre'
        )
        contexto['data']['opciones'] = opciones
        return Response(contexto, status=status.HTTP_200_OK)

    except CestadoAlerta.DoesNotExist:
        contexto['error'] = 'No existe el estado de alerta'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_estado_alerta')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD Vacuna #########

# Obtiene la lista de Vacunas
'''
/catalogos/get_vacunas/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "vacunas": [
            lista de diccionarios {"cvacuna_id","nombre"}
        ]
        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_vacuna', acciones_a_validar=['listar'])
def get_vacunas(request):
    contexto = {}
    try:
        sql = """
            SELECT cvacuna_id, nombre
            FROM triage.cvacuna
            ORDER BY cvacuna_id DESC
        """
        vacunas = db.get_all_pandas(sql)
        if not isinstance(vacunas, bool):
            vacunas = pd.DataFrame(vacunas).replace({np.nan:None})
            vacunas = vacunas.to_dict('records')
        elif isinstance(vacunas, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Vacunas'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['vacunas'] = vacunas
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_vacunas')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Agrega o edita una vacuna
'''
/catalogos/set_vacuna/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre de la vacuna",
        # opcional
        "vacuna_id" = cvacuna_id # esto es para editar una vacuna específica, sino se coloca, lo inserta
    }
Datos enviados por el BACK
    {
        # status 201
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_vacuna', acciones_a_validar=['crear','editar'])
def set_vacuna(request):
    contexto = {'error': ""}
    try:
        v = None
        if 'vacuna_id' in request.data:
            try:
                v = Cvacuna.objects.get(cvacuna_id = request.data.get('vacuna_id'))

                vacuna_serializer = VacunaSerializer(v, data=request.data, context=request.data)
                if vacuna_serializer.is_valid():
                    vacuna_serializer.save()
                    return Response(vacuna_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in vacuna_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except Cvacuna.DoesNotExist:
                contexto['error'] = 'La vacuna a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not v:
            vacuna_serializer = VacunaSerializer(data=request.data, context=request.data)
            if vacuna_serializer.is_valid():
                vacuna_serializer.save()
                return Response(vacuna_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in vacuna_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_vacuna')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

# Obtiene los datos de una Vacuna
'''
/catalogos/get_vacuna/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "vacuna_id" : "id" # esto es para ver información de una vacuna específica
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            "cvacuna_id", "nombre"
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_vacuna', acciones_a_validar=['editar'])
def get_vacuna(request):
    contexto = {}
    try:
        v = Cvacuna.objects.get(cvacuna_id = request.data.get('vacuna_id'))
        contexto['data'] = model_to_dict(v)
        return Response(contexto, status=status.HTTP_200_OK)

    except Cvacuna.DoesNotExist:
        contexto['error'] = 'No existe la vacuna'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_vacuna')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD Medicamento #########

# Obtiene la lista de Medicamentos
'''
/catalogos/get_medicamentos/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "medicamentos": [
            lista de diccionarios {"cmedicamento_id","nombre"}
        ]
        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
#@validate_token_permission(url='c_medicamento', acciones_a_validar=['listar'])
def get_medicamentos(request):
    contexto = {}
    try:
        sql = """
            SELECT cmedicamento_id, nombre
            FROM medicalRecord.cmedicamento
            ORDER BY cmedicamento_id DESC
        """
        medicamentos = db.get_all_pandas(sql)
        if not isinstance(medicamentos, bool):
            medicamentos = pd.DataFrame(medicamentos).replace({np.nan:None})
            medicamentos = medicamentos.to_dict('records')
        elif isinstance(medicamentos, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de medicamentos'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['medicamentos'] = medicamentos
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_medicamentos')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Agrega o edita un medicamento
'''
/catalogos/set_medicamento/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre del medicamento",
        # opcional
        "medicamento_id" = cmedicamento_id # esto es para editar un  medicamento especifico, sino se coloca, lo inserta
    }
Datos enviados por el BACK
    {
        # status 201
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_medicamento', acciones_a_validar=['crear','editar'])
def set_medicamento(request):
    contexto = {'error': ""}
    try:
        m = None
        if 'medicamento_id' in request.data:
            try:
                m = Cmedicamento.objects.get(cmedicamento_id = request.data.get('medicamento_id'))

                medicamento_serializer = MedicamentoSerializer(m, data=request.data, context=request.data)
                if medicamento_serializer.is_valid():
                    medicamento_serializer.save()
                    return Response(medicamento_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in medicamento_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except Cmedicamento.DoesNotExist:
                contexto['error'] = 'El medicamento a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not m:
            medicamento_serializer = MedicamentoSerializer(data=request.data, context=request.data)
            if medicamento_serializer.is_valid():
                medicamento_serializer.save()
                return Response(medicamento_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in medicamento_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:       
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_medicamento')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

# Obtiene los datos de un Medicamento
'''
/catalogos/get_medicamento/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "medicamento_id" : "id" # esto es para ver información de un medicamento específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            "cmedicamento_id", "nombre"
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_medicamento', acciones_a_validar=['editar'])
def get_medicamento(request):
    contexto = {}
    try:
        m = Cmedicamento.objects.get(cmedicamento_id = request.data.get('medicamento_id'))
        contexto['data'] = model_to_dict(m)
        return Response(contexto, status=status.HTTP_200_OK)

    except Cmedicamento.DoesNotExist:
        contexto['error'] = 'No existe el medicamento'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_medicamento')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

######### CRUD Motivo Alta #########

# Obtiene la lista de Motivos de alta
'''
/catalogos/get_motivos_alta/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "motivos_alta": [
            lista de diccionarios {"cmotivo_alta_id","nombre"}
        ]
        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_motivo_alta', acciones_a_validar=['listar'])
def get_motivos_alta(request):
    contexto = {}
    try:
        sql = """
            SELECT cmotivo_alta_id, nombre
            FROM dashboards.cmotivo_alta
            ORDER BY cmotivo_alta_id DESC
        """
        motivos_alta = db.get_all_pandas(sql)
        if not isinstance(motivos_alta, bool):
            motivos_alta = pd.DataFrame(motivos_alta).replace({np.nan:None})
            motivos_alta = motivos_alta.to_dict('records')
        elif isinstance(motivos_alta, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de motivos de alta'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['motivos_alta'] = motivos_alta
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_motivos_alta')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Agrega o edita un motivo de alta
'''
/catalogos/set_motivo_alta/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre del motivo de alta",
        # opcional
        "motivo_alta_id" = cmotivo_alta_id # esto es para editar un motivo de alta especifico, sino se coloca, lo inserta
    }
Datos enviados por el BACK
    {
        # status 201
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_motivo_alta', acciones_a_validar=['crear','editar'])
def set_motivo_alta(request):
    contexto = {'error': ""}
    try:
        m = None
        if 'motivo_alta_id' in request.data:
            try:
                m = CmotivoAlta.objects.get(cmotivo_alta_id = request.data.get('motivo_alta_id'))

                motivo_alta_serializer = MotivoAltaSerializer(m, data=request.data, context=request.data)
                if motivo_alta_serializer.is_valid():
                    motivo_alta_serializer.save()
                    return Response(motivo_alta_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in motivo_alta_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except CmotivoAlta.DoesNotExist:
                contexto['error'] = 'El motivo de alta a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not m:
            motivo_alta_serializer = MotivoAltaSerializer(data=request.data, context=request.data)
            if motivo_alta_serializer.is_valid():
                motivo_alta_serializer.save()
                return Response(motivo_alta_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in motivo_alta_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_motivo_alta')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

# Obtiene los datos de un Motivo de alta
'''
/catalogos/get_motivo_alta/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "motivo_alta_id" : "id" # esto es para ver información de un motivo de alta
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            "cmotivo_alta_id", "nombre"
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_motivo_alta', acciones_a_validar=['editar'])
def get_motivo_alta(request):
    contexto = {}
    try:
        m = CmotivoAlta.objects.get(cmotivo_alta_id = request.data.get('motivo_alta_id'))
        contexto['data'] = model_to_dict(m)
        return Response(contexto, status=status.HTTP_200_OK)

    except CmotivoAlta.DoesNotExist:
        contexto['error'] = 'No existe el motivo de alta'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_motivo_alta')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

######### CRUD Terapeutica #########

# Obtiene la lista de los medicamentos terapeuticos
'''
/catalogos/get_terapeuticas/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "terapeuticas": [
            lista de diccionarios {"cterapeutica_id","nombre"}
        ]
        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_terapeutica', acciones_a_validar=['listar'])
def get_terapeuticas(request):
    contexto = {}
    try:
        sql = """
            SELECT cterapeutica_id, nombre
            FROM medicalRecord.cterapeutica
            ORDER BY cterapeutica_id DESC
        """
        terapeuticas = db.get_all_pandas(sql)
        if not isinstance(terapeuticas, bool):
            terapeuticas = pd.DataFrame(terapeuticas).replace({np.nan:None})
            terapeuticas = terapeuticas.to_dict('records')
        elif isinstance(terapeuticas, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de terapeuticas'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['terapeuticas'] = terapeuticas
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_terapeuticas')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

# Agrega o edita un elemento de terapeutica
'''
/catalogos/set_terapeutica/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre" : "nombre de terapeutica",
        # opcional
        "terapeutica_id" = cterapeutica_id # esto es para editar un registro de terapeutica especifico, sino se coloca, lo inserta
    }
Datos enviados por el BACK
    {
        # status 201
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_terapeutica', acciones_a_validar=['crear','editar'])
def set_terapeutica(request):
    contexto = {'error': ""}
    try:
        t = None
        if 'terapeutica_id' in request.data:
            try:
                t = Cterapeutica.objects.get(cterapeutica_id = request.data.get('terapeutica_id'))

                terapeutica_serializer = TerapeuticaSerializer(t, data=request.data, context=request.data)
                if terapeutica_serializer.is_valid():
                    terapeutica_serializer.save()
                    return Response(terapeutica_serializer.data, status=status.HTTP_201_CREATED)

                for campo, value in terapeutica_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            except Cterapeutica.DoesNotExist:
                contexto['error'] = 'El registro de terapeutica a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not t:
            terapeutica_serializer = TerapeuticaSerializer(data=request.data, context=request.data)
            if terapeutica_serializer.is_valid():
                terapeutica_serializer.save()
                return Response(terapeutica_serializer.data, status=status.HTTP_201_CREATED)

            for campo, value in terapeutica_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_terapeutica')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

# Obtiene los datos de un registro de terapeutica
'''
/catalogos/get_terapeutica/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "terapeutica_id" : "id" # esto es para ver información de un motivo de alta
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            "cterapeutica_id", "nombre"
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='c_terapeutica', acciones_a_validar=['editar'])
def get_terapeutica(request):
    contexto = {}
    try:
        t = Cterapeutica.objects.get(cterapeutica_id =  request.data.get('terapeutica_id'))
        contexto['data'] = model_to_dict(t)
        return Response(contexto, status=status.HTTP_200_OK)

    except Cterapeutica.DoesNotExist:
        contexto['error'] = 'No existe el registro de terapeutica'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_terapeutica')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)