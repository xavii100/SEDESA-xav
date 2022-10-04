from django.conf import settings
from django.contrib.auth import logout

from rest_framework.response import Response
from rest_framework import status

from users.models import *

from utils.inc_utils import *

import jwt
import traceback


# ----------------------------------
# -------Función decoradora---------
# ----------------------------------

# Valida token y permisos de usuarios por roles
def validate_token_permission(url=None, acciones_a_validar=[]):
    def decorator_token_permission_rol(func):
        def verification(request, *args, **kwargs):
            contexto = {}

            def is_true():
                return func(request, *args, **kwargs)

            def is_false():
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

            try:
                # if not request.user.is_authenticated:
                #     contexto['error'] = 'Usuario no autenticado'
                #     return is_false()

                try:
                    payload = jwt.decode(
                        request.data.get('token'),
                        settings.SECRET_KEY,
                        leeway=settings.TIME_TOKEN_DELAY,
                        algorithms=['HS256']
                    )

                except jwt.ExpiredSignatureError:
                    contexto['error'] = 'Token expirado'
                    logout(request)
                    return is_false()

                except jwt.PyJWTError:
                    contexto['error'] = 'Token inválido'
                    return is_false()

                if payload['type'] != 'authorization':
                    contexto['error'] = 'Token inválido'
                    return is_false()

                request.data['usuario_id'] = payload['usuario_id']
                user = Usuario.objects.get(tusuario_id=payload['usuario_id'])
                request.data['id_hospital_user'] = user.thospital.thospital_id
                request.data['admin'] = user.crol.sudo

                if not user.is_active:
                    contexto['error'] = 'El usuario está inactivo'
                    return is_false()

                if user.crol.sudo:
                    return is_true()

                if not url and user.crol.sudo:
                    return is_true()

                if url in ('set_profile', 'get_user'):
                    return is_true()

                # { "url" : [ acciones ] }
                permisos = get_permisos_user(user)

                if url in permisos.keys() and elemnt_list_in_list(permisos[url], acciones_a_validar):
                    return is_true()

                contexto['error'] = 'Ha ocurrido un error de verificación y permisos.'
                return is_false()

            except:
                contexto['log'] = 'Error verification ({})'.format(traceback.format_exc().replace('\n', ' '))
                contexto['error'] = 'Ha ocurrido un error de verificación.'
                return is_false()

        return verification

    return decorator_token_permission_rol


def get_permisos_user(user):
    permisos = {}
    permiso_rol = TpermisoRolVista.objects.exclude(acciones='').filter(crol=user.crol)
    for pr in permiso_rol:
        permisos[pr.cmodulo_vista.url] = pr.acciones.split(',') if pr.acciones else None
    return permisos
