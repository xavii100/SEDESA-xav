from django.contrib.auth import authenticate, login, logout
from django.template.loader import render_to_string
from django.urls import reverse
from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import jwt
import traceback
from datetime import datetime

from users.models import *
from config.decorators import get_permisos_user

from utils.inc_utils import *
from utils.inc_db import Database
db = Database()


######### AUTHORIZATION #########

# Autenticación
'''
/users/login/
Datos enviados por el FRONT
    {
        "email": "email",
        "password": "password",
    }
Datos enviados por el BACK
    {
        # status 200
        "token": "token_autorización", # usuario_id, exp, type
        "success": "Texto de success para mostrarle al usuario en el sistema",

        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
        # opcional
        "log": "Error de Excepction"
    }
'''
@api_view(['POST'])
def doLogin(request):
    contexto = {}

    try:
        email = request.data['email'].lower().strip()
        try:
            user = Usuario.objects.get( email=email )

        except Usuario.DoesNotExist:
            contexto['error'] = 'No tienes una cuenta de usuario asignada con este correo electrónico'

        else:
            if user.is_active:
                # Intenta el login
                user = authenticate(request, email=email, password=request.data.get('password'))
                if user is not None:
                    login(request, user)
                    payload = {
                        'usuario_id': user.tusuario_id,
                        'nombre_completo': ' '.join([user.nombre, user.apellido_paterno, user.apellido_materno]),
                        'rol': user.crol.rol,
                        'admin': user.crol.sudo,
                        'hospital_id': user.thospital.thospital_id,
                        'hospital': user.thospital.nombre,
                        'hospital_corto': user.thospital.nombre_corto,
                        'permisos': get_permisos_user(user),
                        'exp': datetime.utcnow() + settings.TIME_TOKEN_EXPIRATION,
                        'type': 'authorization'
                    }
                    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                    contexto['token'] = token.decode('utf-8')
                    contexto['success'] = 'Credenciales correctas para la autenticación'
                    return Response(contexto, status=status.HTTP_200_OK)

                else:
                    contexto['error'] = 'Credenciales incorrectas para la autenticación'
            else:
                contexto['error'] = 'Su cuenta de usuario está inactiva'

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'doLogin')

    return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Logout
'''
/users/logout/
Datos enviados por el BACK
    {
        # status 200
        "success": "Texto de success para mostrarle al usuario en el sistema",

        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
        # opcional
        "log": "Error de Excepction"
    }
'''
@api_view(['GET','POST'])
def doLogout(request):
    contexto = {}
    try:
        logout(request)
        contexto['success'] = 'Deslogeo de usuario satisfactoriamente'
    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'doLogout')

    return Response(contexto, status=status.HTTP_200_OK)

