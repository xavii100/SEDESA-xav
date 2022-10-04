from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from config.decorators import validate_token_permission

import pandas as pd
import numpy as np
import traceback

# from users.serializers import TestSerializer, PacienteSerializer
from users.models import *

from utils.inc_utils import *
from utils.inc_db import Database
db = Database()


######### CRUD Triage #########

# Obtiene la lista para la carga del Formulario en Triage
'''
/triage/get_carga_formulario/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "sintomas_principales": [
            lista de diccionarios {"csintoma_id", "nombre", "abreviatura", "principal", "boolean" }
        ]
        "sintomas_secundarios": [
            lista de diccionarios {"csintoma_id", "nombre", "abreviatura", "principal", "boolean" }
        ]
        "constantes_vitales": [
            lista de diccionarios {"cconstante_vital_id","nombre","abreviatura","min","max","alerta_menor_que","alerta_mayor_que" }
        ]
        "antecedentes": [
            lista de diccionarios {"cantecedente_id","nombre","abreviatura","sinonimos","boolean" }
        ]
        "estado_alerta": [
            lista de diccionarios {"cestado_alerta_id","nombre","abreviatura","cantidad","opciones": {"cestado_alerta_opcion_id","nombre"} }
        ]
        "vacunas": [
            lista de vacunas {"cvacuna_id","nombre"}
        ]
        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='triage', acciones_a_validar=['crear'])
def get_carga_formulario(request):
    contexto = {}
    try:
        # Síntomas
        sql = "SELECT csintoma_id, nombre, abreviatura, principal FROM triage.csintoma"
        sintomas = db.get_all_pandas(sql)
        if not isinstance(sintomas, bool):
            sintomas['boolean'] = False # Datos de relleno para front
            sintomas = pd.DataFrame(sintomas).replace({np.nan:None})
            sintomas_principales = sintomas[sintomas['principal'] == True].to_dict('records')
            sintomas_secundarios = sintomas[sintomas['principal'] == False].to_dict('records')
        elif isinstance(sintomas, bool):
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Síntomas'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        # Constantes Vitales
        sql = """
            SELECT
                cconstante_vital_id, nombre, abreviatura, min, max,
                alerta_menor_que, alerta_mayor_que
            FROM triage.cconstante_vital
        """
        constantes_vitales = db.get_all_pandas(sql)
        if not isinstance(constantes_vitales, bool):
            constantes_vitales = pd.DataFrame(constantes_vitales).replace({np.nan:None})
            constantes_vitales = constantes_vitales.to_dict('records')
        elif isinstance(constantes_vitales, bool):
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Constantes Vitales'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        # Antecedentes
        sql = """
            SELECT
                cantecedente_id, nombre, abreviatura, sinonimos
            FROM triage.cantecedente
        """
        antecedentes = db.get_all_pandas(sql)
        if not isinstance(antecedentes, bool):
            antecedentes['boolean'] = False # Datos de relleno para front
            antecedentes = pd.DataFrame(antecedentes).replace({np.nan:None})
            antecedentes = antecedentes.to_dict('records')
        elif isinstance(antecedentes, bool):
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Antecedentes'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        # Estados de Alerta
        sql = "SELECT cestado_alerta_id, nombre, abreviatura FROM triage.cestado_alerta"
        estados_alerta = db.get_all_pandas(sql)
        if not isinstance(estados_alerta, bool):
            estados_alerta = pd.DataFrame(estados_alerta).replace({np.nan:None})
            estados_alerta['cantidad'] = 0 # Datos de relleno para front
            estados_alerta['opciones'] = [[]] * estados_alerta.shape[0] # Datos de relleno para front
            estados_alerta = estados_alerta.to_dict('records')
        elif isinstance(estados_alerta, bool):
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Estados de Alerta'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        sql = "SELECT cestado_alerta_opcion_id, nombre, estado_alerta_id FROM triage.cestado_alerta_opcion"
        estados_alerta_op = db.get_all_pandas(sql)
        if isinstance(estados_alerta_op, bool):
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Estados de Alerta de Opinión'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not estados_alerta_op.empty:
            estados_alerta_op = pd.DataFrame(estados_alerta_op).replace({np.nan:None})
            for e in estados_alerta:
                e['opciones'] = estados_alerta_op[estados_alerta_op['estado_alerta_id'] == e['cestado_alerta_id']][['cestado_alerta_opcion_id','nombre']].to_dict('records')

        # Vacunas
        sql = """
            SELECT
                cvacuna_id, nombre
            FROM triage.cvacuna
        """
        vacunas = db.get_all_pandas(sql)
        if not isinstance(vacunas, bool):
            vacunas['boolean'] = False # Datos de relleno para front
            vacunas = pd.DataFrame(vacunas).replace({np.nan:None})
            vacunas = vacunas.to_dict('records')
        elif isinstance(vacunas, bool):
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Vacunas'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['sintomas_principales'] = sintomas_principales
        contexto['sintomas_secundarios'] = sintomas_secundarios
        contexto['constantes_vitales'] = constantes_vitales
        contexto['antecedentes'] = antecedentes
        contexto['estado_alerta'] = estados_alerta
        contexto['vacunas'] = vacunas

        # for k in contexto.keys():
        #     for d in contexto[k]:
        #         for c in d.keys():
        #             d[c] = None if (np.isnan(d[c]) if (type(d[c]) == float or type(d[c]) == np.float64) else False) else d[c]

        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_carga_formulario')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Guarda el Formulario en Triage
'''
/triage/set_crea_formulario/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "nombre": "nombre",
        "filiacion": "filiacion",
        "fecha_nacimiento": "fecha_nacimiento",
        "genero": "H/M",
        "fecha_inicio_sintomas": "fecha_inicio_sintomas",
        "embarazo" : "embarazo",
        "semanas_gestacion" : "semanas_gestacion",
        "sospecha_covid" : "sospecha_covid",
        "vacuna_influenza" : "True/False",
        "puntaje_news2" : "puntaje_news2",
        "puntaje_qsofa" : "puntaje_qsofa",
        "puntaje_glassgow" : "puntaje_glassgow",
        "sintomas": [ids_sintomas],
        "estados_alerta": [ids_estados_alerta],
        "antecedentes": [ids_antecedentes],
        "contacto_infectado_covid": "True/False",
        "fecha_contacto_infectado": "fecha_contacto_sintomas",
        "vacunas" : [
            {
                "id" : "vacuna_id",
                "dosis" : "dosis_vacuna"
            }
        ],
        "constantes_vitales": [
            {
                "id": "id_constante_vital",
                "cantidad" : "cantidad"
            }
        ]

    }
Datos enviados por el BACK
    {
        # status 200
        "success": "Texto de success para mostrarle al usuario en el sistema"
        
        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
        # opcional
        "log": "Error de Excepction"
    }
'''
@api_view(['POST'])
@validate_token_permission(url='triage', acciones_a_validar=['crear'])
def set_crea_formulario(request):
    contexto = {}
    try:
        if (
            request.data.get('sintomas') and request.data['sintomas'] and isinstance(request.data['sintomas'], list) \
            and len(request.data['sintomas'])>0
        ):
            sintomas = set(request.data['sintomas'])
            sql = """
                SELECT csintoma_id FROM triage.csintoma
            """
            df_csintomas = db.get_all_pandas(sql)
            if not isinstance(df_csintomas, bool):
                list_sintomas = set(df_csintomas['csintoma_id'].tolist()) # ids BD
                if len(sintomas - list_sintomas) > 0:
                    contexto['error'] = 'Un id seleccionado de sintomas, no existe en la base de datos'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
                elif isinstance(df_csintomas, bool):
                    print("Error de consulta:\n{}".format(db.error))
                    contexto['log'] = "Error de consulta:\n{}".format(db.error)
                    contexto['error'] = 'No existen datos de Sintomas'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
        else:
            contexto['error'] = 'Al menos debe ser registrado un sintoma'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if (request.data.get('estados_alerta') and request.data['estados_alerta'] and isinstance(request.data['estados_alerta'], list) \
            and len(request.data['estados_alerta'])>0
        ):
            estados_alerta = set(request.data['estados_alerta'])
            sql = """
                SELECT cestado_alerta_opcion_id FROM triage.cestado_alerta_opcion
            """
            df_cestados = db.get_all_pandas(sql)
            if not isinstance(df_cestados, bool):
                list_estados = set(df_cestados['cestado_alerta_opcion_id'].tolist())
                if len(estados_alerta - list_estados) > 0:
                    contexto['error'] = 'Un id seleccionado de estados de alerta, no existe en la base de datos'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
                elif isinstance(df_cestados,bool):
                    print("Error de consulta:\n{}".format(db.error))
                    contexto['log'] = "Error de consulta:\n{}".format(db.error)
                    contexto['error'] = 'No existen datos de estados de alerta'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
        else:
            contexto['error'] = 'Al menos debe ser registrado un estado de alerta'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if (request.data.get('antecedentes') and request.data['antecedentes'] and isinstance(request.data['antecedentes'], list) \
            and len(request.data['antecedentes'])>0
        ):
            antecedentes = set(request.data['antecedentes'])
            sql = """
                SELECT cantecedente_id FROM triage.cantecedente
            """
            df_cantecedentes = db.get_all_pandas(sql)
            if not isinstance(df_cantecedentes,bool):
                list_antecedentes = set(df_cantecedentes['cantecedente_id'].tolist())
                if len(antecedentes - list_antecedentes) > 0:
                    contexto['error'] = 'Un id seleccionado de antecedentes, no existe en la base de datos'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
                elif isinstance(df_cantecedentes,bool):
                    print("Error de consulta:\n{}".format(db.error))
                    contexto['log'] = "Error de consulta:\n{}".format(db.error)
                    contexto['error'] = 'No existen datos de antecedentes'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
        else:
            contexto['error'] = 'Al menos debe ser registrado un antecedente'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if (request.data.get('constantes_vitales') and request.data['constantes_vitales'] and isinstance(request.data['constantes_vitales'], list) \
            and len(request.data['constantes_vitales']) > 0
        ):
            constantes_vitales = request.data['constantes_vitales']
            i, constantes_id, constantes_v = 0, set(), []
            for diccionario in constantes_vitales:
                if 'id' in diccionario.keys():
                    if diccionario['id'] in constantes_id:
                        del constantes_vitales[i]
                        i = i-1 if i>0 else 0
                    else:
                        constantes_id.add(diccionario['id'])
                        constantes_v.append(diccionario)
                        i += 1
                else:
                    del constantes_vitales[i]
                    i = i-1 if i>0 else 0

            if len(constantes_v) == 0:
                contexto['error'] = 'Al menos debe ser registrada una constante vital'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            sql = """
                SELECT cconstante_vital_id FROM triage.cconstante_vital
            """
            df_cconstante = db.get_all_pandas(sql)
            if not isinstance(df_cconstante, bool):
                list_constante = set(df_cconstante['cconstante_vital_id'].tolist()) # ids BD
                if len(constantes_id - list_constante) > 0:
                    contexto['error'] = 'Un id seleccionado de constantes vitales, no existe en la base de datos'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
                elif isinstance(df_cconstante, bool):
                    print("Error de consulta:\n{}".format(db.error))
                    contexto['log'] = "Error de consulta:\n{}".format(db.error)
                    contexto['error'] = 'No existen datos de constantes vitales'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
        else:
            contexto['error'] = 'Al menos debe ser registrada una constante vital'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if (request.data.get('vacunas') and request.data['vacunas'] and isinstance(request.data['vacunas'], list) \
            and len(request.data['vacunas']) > 0
        ):
            vacunas = request.data['vacunas']
            i, vacunas_id, vacunas_v = 0, set(), []
            for diccionario in vacunas:
                if 'id' in diccionario.keys():
                    if diccionario['id'] in vacunas_id:
                        del vacunas[i]
                        i = i-1 if i>0 else 0
                    else:
                        vacunas_id.add(diccionario['id'])
                        vacunas_v.append(diccionario)
                        i += 1
                else:
                    del vacunas[i]
                    i = i-1 if i>0 else 0

            sql = """
                SELECT cvacuna_id FROM triage.cvacuna
            """
            df_vacuna = db.get_all_pandas(sql)
            if not isinstance(df_vacuna, bool):
                list_vacuna = set(df_vacuna['cvacuna_id'].tolist()) # ids BD
                if len(vacunas_id - list_vacuna) > 0:
                    contexto['error'] = 'Un id seleccionado de vacunas, no existe en la base de datos'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
                elif isinstance(df_vacuna, bool):
                    print("Error de consulta:\n{}".format(db.error))
                    contexto['log'] = "Error de consulta:\n{}".format(db.error)
                    contexto['error'] = 'No existen datos de Vacunas'
                    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        p = TpacienteTriage()

        if 'nombre' in request.data:
            p.nombre = request.data['nombre']
        else:
            contexto['error'] = 'El  campo nombre, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'filiacion' in request.data:
            p.filiacion = request.data[ 'filiacion']
        else:
            contexto['error'] = 'El  campo filiacion, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'fecha_nacimiento' in request.data:
            p.fecha_nacimiento = request.data['fecha_nacimiento']
        else:
            contexto['error'] = 'El  campo fecha de nacimiento, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'genero' in request.data:
            p.genero = request.data['genero']
        else:
            contexto['error'] = 'El  campo genero, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'fecha_inicio_sintomas' in request.data:
            p.fecha_inicio_sintomas = request.data['fecha_inicio_sintomas']
        else:
            contexto['error'] = 'El  campo fecha inicio de sintomas, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'contacto_infectado_covid' in request.data:
            p.contacto_infectado_covid = request.data['contacto_infectado_covid']

        if 'fecha_contacto_infectado' in request.data:
            p.fecha_contacto_infectado = request.data['fecha_contacto_infectado']

        if 'embarazo' in request.data:
            p.embarazo = request.data['embarazo']

        if 'semanas_gestacion' in request.data:
            p.semanas_gestacion = request.data['semanas_gestacion']

        if 'sospecha_covid' in request.data:
            p.sospecha_covid = request.data['sospecha_covid']
        else:
            contexto['error'] = 'El  campo sospecha covid, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'puntaje_news2' in request.data:
            p.puntaje_news2 = request.data['puntaje_news2']
        else:
            contexto['error'] = 'El  campo puntaje news2 no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'puntaje_qsofa' in request.data:
            p.puntaje_qsofa = request.data['puntaje_qsofa']
        else:
            contexto['error'] = 'El  campo puntaje qsofa, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'puntaje_glassgow' in request.data:
            p.puntaje_glassgow = request.data['puntaje_glassgow']
        else:
            contexto['error'] = 'El  campo puntaje glassgow, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if 'vacuna_influenza' in request.data:
            p.vacuna_influenza = request.data['vacuna_influenza']
        else:
            contexto['error'] = 'El  campo puntaje vacuna influenza, no puede ser nulo'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        usuario = Usuario.objects.get(tusuario_id=request.data.get('usuario_id', 1))
        p.thospital = usuario.thospital # thospital_id = 1
        p.tusuario = usuario # p.tusuario_id =   # 1 request.data['usuario_id'] request.user.id
        p.save()

        for dic_vacuna in vacunas:
            vacuna = Cvacuna.objects.get(cvacuna_id=dic_vacuna['id'])
            if vacuna:
                rg_vacuna = TregistroVacuna()
                rg_vacuna.cvacuna = vacuna
                rg_vacuna.tpaciente_triage = p
                rg_vacuna.dosis = dic_vacuna.get('dosis')
                rg_vacuna.save()

        
        for sintoma_id in sintomas:
            sintoma = Csintoma.objects.get(csintoma_id=sintoma_id)
            if sintoma:
                rg_sintoma = TregistroSintoma()
                rg_sintoma.csintoma = sintoma
                rg_sintoma.tpaciente_triage = p
                rg_sintoma.save()


        for estado_id in estados_alerta:
            estado = CestadoAlertaOpcion.objects.get(cestado_alerta_opcion_id=estado_id)
            if estado:
                rg_estado = TregistroEstadoAlerta()
                rg_estado.cestado_alerta_opcion = estado 
                rg_estado.tpaciente_triage = p
                rg_estado.save()
            

        for antecedente_id in antecedentes:
            antecedente = Cantecedente.objects.get(cantecedente_id=antecedente_id)
            if antecedente:
                rg_antecedente = TregistroAntecedente()
                rg_antecedente.cantecedente = antecedente 
                rg_antecedente.tpaciente_triage = p
                rg_antecedente.save()


        for dic_constante in constantes_v:
            vital = CconstanteVital.objects.get(cconstante_vital_id=dic_constante['id'])
            if vital:      
                rg_vital = TregistroConstanteVital()          
                rg_vital.cconstante_vital = vital
                rg_vital.tpaciente_triage = p
                rg_vital.cantidad = dic_constante.get('cantidad')
                rg_vital.save()

        contexto['success'] = 'Se ha insertado el paciente'
        return Response(contexto, status=status.HTTP_200_OK)
    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_crea_formulario')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene la lista de Pacientes Triage
'''
/triage/get_pacientes/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            # datos de los pacientes (ejemplo visto en la carpeta "contrato")
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='triage', acciones_a_validar=['listar'])
def get_pacientes(request):
    contexto = {}
    try:
        # Si es un usuario ROOT se debe de mostrar todos los datos de todos los Pacientes, 
        # # sino, se muestran los Pacientes del Hospital al que pertenece el Usuario
        if request.data.get('sudo'):
            pacientes = TpacienteTriage.objects.all()
        else:
            pacientes = TpacienteTriage.objects.filter(thospital_id=request.data.get('id_hospital_user', 1))

        contexto['data'] = []
        for paciente in pacientes:
            data = {
                'nombre': paciente.nombre,
                'fecha_registro': paciente.fecha_registro.strftime("%Y-%m-%d, %H:%M"),
                'genero': paciente.genero,
                'fecha_nacimiento': paciente.fecha_nacimiento,
                'edad': datetime.now().year - paciente.fecha_nacimiento.year,
                'fecha_inicio_sintomas': paciente.fecha_inicio_sintomas,
                'embarazo': paciente.embarazo,
                'semanas_gestacion': paciente.semanas_gestacion,
                'filiacion': paciente.filiacion,
                'puntaje_news2': paciente.puntaje_news2,
                'puntaje_qsofa': paciente.puntaje_qsofa,
                'puntaje_glassgow': paciente.puntaje_glassgow,
                'sospecha_covid': paciente.sospecha_covid,
                'hospital': paciente.thospital.nombre,
                'hospital_corto': paciente.thospital.nombre_corto,
                "elaborado": ' '.join([paciente.tusuario.nombre, paciente.tusuario.apellido_paterno, paciente.tusuario.apellido_materno])
            }

            sintomas = TregistroSintoma.objects.filter(tpaciente_triage=paciente).values(
                'csintoma__nombre', 'csintoma__abreviatura', 'csintoma__principal'
            )
            data['sintomas'] = sintomas

            antecedentes = TregistroAntecedente.objects.filter(tpaciente_triage=paciente).values('cantecedente__nombre')
            data['antecedentes'] = antecedentes

            estados_alerta = TregistroEstadoAlerta.objects.filter(tpaciente_triage=paciente).values(
                'cestado_alerta_opcion__nombre', 'cestado_alerta_opcion__estado_alerta__nombre', 'cestado_alerta_opcion__estado_alerta__abreviatura'
            )
            data['estados_alerta'] = estados_alerta

            constantes_vitales = TregistroConstanteVital.objects.filter(tpaciente_triage=paciente).values(
                'cconstante_vital__nombre', 'cantidad'
            )
            data['constantes_vitales'] = constantes_vitales

            contexto['data'].append(data)

        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_paciente')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene el detalle de un Paciente
'''
/triage/get_detalle_paciente/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "id_paciente": "id_paciente"
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            # datos del paciente (ejemplo visto en la carpeta "contrato")
        }

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='triage', acciones_a_validar=['listar'])
def get_detalle_paciente(request):
    contexto = {}

    if not 'id_paciente' in request.data:
        contexto['error'] = 'No se tiene el id_paciente'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    try:
        paciente = TpacienteTriage.objects.get(tpaciente_triage_id=request.data.get('id_paciente'))
        contexto['data'] = {
            'nombre': paciente.nombre,
            'fecha_registro': paciente.fecha_registro.strftime("%Y-%m-%d, %H:%M"),
            'genero': paciente.genero,
            'fecha_nacimiento': paciente.fecha_nacimiento,
            'edad': datetime.now().year - paciente.fecha_nacimiento.year,
            'fecha_inicio_sintomas': paciente.fecha_inicio_sintomas,
            'embarazo': paciente.embarazo,
            'semanas_gestacion': paciente.semanas_gestacion,
            'filiacion': paciente.filiacion,
            'puntaje_news2': paciente.puntaje_news2,
            'puntaje_qsofa': paciente.puntaje_qsofa,
            'puntaje_glassgow': paciente.puntaje_glassgow,
            'sospecha_covid': paciente.sospecha_covid,
            'hospital': paciente.thospital.nombre,
            'hospital_corto': paciente.thospital.nombre_corto,
            "elaborado": ' '.join([paciente.tusuario.nombre, paciente.tusuario.apellido_paterno, paciente.tusuario.apellido_materno])
        }

        sintomas = TregistroSintoma.objects.filter(tpaciente_triage=paciente).values(
            'csintoma__nombre', 'csintoma__abreviatura', 'csintoma__principal'
        )
        contexto['data']['sintomas'] = sintomas

        antecedentes = TregistroAntecedente.objects.filter(tpaciente_triage=paciente).values('cantecedente__nombre')
        contexto['data']['antecedentes'] = antecedentes

        estados_alerta = TregistroEstadoAlerta.objects.filter(tpaciente_triage=paciente).values(
            'cestado_alerta_opcion__nombre', 'cestado_alerta_opcion__estado_alerta__nombre', 'cestado_alerta_opcion__estado_alerta__abreviatura'
        )
        contexto['data']['estados_alerta'] = estados_alerta

        constantes_vitales = TregistroConstanteVital.objects.filter(tpaciente_triage=paciente).values(
            'cconstante_vital__nombre', 'cantidad'
        )
        contexto['data']['constantes_vitales'] = constantes_vitales

        return Response(contexto, status=status.HTTP_200_OK)

    except TpacienteTriage.DoesNotExist:
        contexto['error'] = 'No existe el paciente'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_detalle_paciente')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)




######### Ejemplo de Prueba #########
# Create your views here.

# @api_view(['GET', 'POST'])
# def test(request):
#     try:
#         sql = "SELECT * FROM triage.csintoma"
#         datos = db.get_all(sql)
#         df = db.get_all_pandas(sql)
#         print('datos array de dictionario', datos)
#         print('datos dataframe', df)

#         if request.method == 'GET':
#             test = Csintoma.objects.all()
#             serializer = TestSerializer(test, many=True)
#             return Response(serializer.data)

#         elif request.method == 'POST':
#             serializer = TestSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(status=status.HTTP_201_CREATED)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     except:
#         import traceback
#         print('Error ({})'.format(traceback.format_exc().replace('\n', ' ')))
        

# @api_view(['DELETE'])
# def test_detail(request, csintoma_id):
#     try:
#         test = Csintoma.objects.get(pk=csintoma_id)
#     except Csintoma.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'DELETE':
#         test.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

