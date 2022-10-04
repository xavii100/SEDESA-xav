from django.utils import timezone
from django.template.loader import render_to_string
from django.urls import reverse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import traceback
import pandas as pd

from users.serializers import *
from users.models import *

from config.decorators import validate_token_permission, get_permisos_user
from utils.inc_utils import *
from utils.inc_db import Database
db = Database()


######### CRUD USUARIOS #########

# Obtiene la lista de Usuarios
'''
/users/get_users/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "listado_usuarios": [lista de diccionarios
            {"tusuario_id": id, "is_active": True/False, "nombre_usuario": "nombre completo",
            "email": "email", "rol": "rol", "nombre_hospital": "nombre_hospital"}
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission()
def get_users(request):
    contexto = {'listado_usuarios': []}

    try:
        sql = """
            SELECT
                u.tusuario_id,
                u.is_active,
                CONCAT_WS(' ', u.nombre, u.apellido_paterno, u.apellido_materno) as nombre_usuario,
                u.email,
                r.rol,
                h.nombre as nombre_hospital
            FROM
                public.usuario as u JOIN general.thospital as h
                ON u.thospital_id = h.thospital_id
                JOIN general.crol as r ON u.crol_id = r.crol_id
            WHERE
                u.email NOT LIKE %s
            ORDER BY
                date_joined DESC
        """
        df_usuarios = db.get_all_pandas(sql, ['%#$%'])
        if not isinstance(df_usuarios, bool):
            contexto['listado_usuarios'] = df_usuarios.to_dict('records')

        elif isinstance(df_usuarios, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existen datos de Usuarios'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_users')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de un Usuario
'''
/users/get_user/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "id_user": id_user # esto es para ver información de un usuario específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            'usuario_id': ,
            'email': ,
            'nombre': ,
            'apellido_paterno': ,
            'apellido_materno': ,
            'nombre_completo': ,
            "fecha_nacimiento": "YYYY-MM-DD",
            "sexo": "letras: M/F",
            "curp": "curp",
            "rfc": "rfc",
            "telefono": "telefono",
            "cedula_profesional": "cedula_profesional",
            "usuario_autoriza": "usuario_autoriza",
            "cargo_usuario_autoriza": "cargo_usuario_autoriza",
            'rol_id': ,
            'rol': ,
            'admin': true/false,
            'hospital_id': ,
            'hospital': ,
            'hospital_corto': ,
            "permisos": {
                "url" : [ acciones ]
            }
        }

        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
        # opcional
        "log": "Error de Excepction"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission(url='get_user')
def get_user(request):
    contexto = {}
    try:
        user = Usuario.objects.get(tusuario_id=request.data.get('id_user'))

        contexto['data'] = {
            'usuario_id': user.tusuario_id,
            'email': user.email,
            'nombre': user.nombre,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'nombre_completo': ' '.join([user.nombre, user.apellido_paterno, user.apellido_materno]),
            'fecha_nacimiento': user.fecha_nacimiento,
            'sexo': user.sexo,
            'curp': user.curp,
            'rfc': user.rfc,
            'telefono': user.telefono,
            'cedula_profesional': user.cedula_profesional,
            'usuario_autoriza': user.usuario_autoriza,
            'cargo_usuario_autoriza': user.cargo_usuario_autoriza,
            'rol_id': user.crol.crol_id,
            'rol': user.crol.rol,
            'admin': user.crol.sudo,
            'hospital_id': user.thospital.thospital_id,
            'hospital': user.thospital.nombre,
            'hospital_corto': user.thospital.nombre_corto,
        }
        contexto['data']['permisos'] = get_permisos_user(user)

        return Response(contexto, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        contexto['error'] = 'No existe usuario'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_user')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Añade o edita Usuario, cuando se agrega uno se le envía notificación por Email de su acceso
'''
/users/set_user/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "thospital": id_hospital,
        "crol": id_rol,
        "email": "email",

        # opcional
        "id_usuario": id_usuario # esto es para editar un usuario específico, sino se coloca, lo inserta
        "password": "password",
        "nombre": "nombre",
        "apellido_paterno": "apellido_paterno",
        "apellido_materno": "apellido_materno",
        "fecha_nacimiento": Acepta cualquiera de los formatos siguientes: "%Y-%m-%d","%Y/%m/%d","%d-%m-%Y","%d/%m/%Y",
        "sexo": "letras: M/F",
        "curp": "curp",
        "rfc": "rfc",
        "telefono": "telefono",
        "cedula_profesional": "cedula_profesional",
        "usuario_autoriza": "usuario_autoriza",
        "cargo_usuario_autoriza": "cargo_usuario_autoriza"
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
@api_view(['GET','POST'])
@validate_token_permission()
def set_user(request):
    contexto = {}
    try:
        try:
            thospital = Thospital.objects.get(thospital_id=request.data.get('thospital'))
            request.data['thospital'] = thospital.thospital_id
        except Thospital.DoesNotExist:
            contexto['error'] = 'El hospital asignado al usuario no existe dentro de la base de datos'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        try:
            crol = Crol.objects.get(crol_id=request.data.get('crol'))
            request.data['crol'] = crol.crol_id
        except Crol.DoesNotExist:
            contexto['error'] = 'El rol asignado al usuario no existe dentro de la base de datos'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        u = None
        request.data['change_password'] = True
        if 'id_usuario' in request.data:
            try:
                u = Usuario.objects.get(tusuario_id=request.data.get('id_usuario'))

                if not 'password' in request.data:
                    request.data['password'] = u.password
                    request.data['change_password'] = False

                usuario_serializer = UsuarioSerializer(u, data=request.data, context=request.data)
                if usuario_serializer.is_valid():
                    usuario_serializer.save()
                    contexto['success'] = 'Los datos del usuario se han guardado correctamente.'
                    return Response(contexto, status=status.HTTP_201_CREATED)

                contexto['error'] = ''
                for campo, value in usuario_serializer.errors.items():
                    contexto['error'] += "{}: {}.".format(campo, " ".join(value))
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)  

            except Usuario.DoesNotExist:
                contexto['error'] = 'El usuario a editar no existe dentro de la base de datos'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if not u:
            usuario_serializer = UsuarioSerializer(data=request.data, context=request.data)
            if usuario_serializer.is_valid():
                usuario_serializer.save()
                contexto['success'] = 'Los datos del usuario se han guardado correctamente.'
                return Response(contexto, status=status.HTTP_201_CREATED)

            contexto['error'] = ''
            for campo, value in usuario_serializer.errors.items():
                contexto['error'] += "{}: {}.".format(campo, " ".join(value))
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_user')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    # try:
    #     u, pasw, username, nuevo = None, '', '', False

    #     if 'id_usuario' in request.data:
    #         u = Usuario.objects.get(tusuario_id=request.data.get('id_usuario'))

    #     if not u:
    #         u = Usuario()
    #         pasw = random_chunk()
    #         u.set_password(pasw)
    #         nuevo = True

    #     if 'email' in request.data and request.data.get('email') and request.data['email'].strip():
    #         others = Usuario.objects.exclude(tusuario_id=request.data.get('id_usuario',0)).filter(email=request.data['email'].lower().strip())
    #         if others:
    #             contexto['error'] = 'Ya existe un usuario con la dirección de correo proporcionada'
    #             return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
    #         # Set email
    #         u.email = request.data['email'].lower().strip()

    #     if 'password' in request.data and request.data.get('password') and request.data['password'].strip():
    #         # Guarda el password
    #         u.set_password(request.data['password'])

    #     if 'nombre' in request.data and request.data.get('nombre') and request.data['nombre'].strip():
    #         u.nombre = request.data['nombre'].strip()
    #         username += u.nombre + ' '
    #     if 'apellido_paterno' in request.data and request.data.get('apellido_paterno') and request.data['apellido_paterno'].strip():
    #         u.apellido_paterno = request.data['apellido_paterno'].strip()
    #         username += u.apellido_paterno + ' '
    #     if 'apellido_materno' in request.data and request.data.get('apellido_materno') and request.data['apellido_materno'].strip():
    #         u.apellido_materno = request.data['apellido_materno'].strip()
    #         username += u.apellido_materno + ' '

    #     u.thospital = Thospital.objects.get(thospital_id=request.data['thospital'])
    #     u.crol = Crol.objects.get(crol_id=request.data['crol'])

    #     u.save()
    #     contexto['success'] = 'Los datos del usuario se han guardado correctamente.'
        # if nuevo:
        #     try:
        #         url = request.build_absolute_uri(reverse('front', kwargs={'url':'autenticacion'}))
        #         if request.is_secure: url = url.replace("http://", "https://")

        #         html = render_to_string('emails/template_new_user.html', {
        #             'user': username.strip(),
        #             'email': u.email,
        #             'password': request.data.get('password', pasw),
        #             'url': url
        #         })
        #         body = {
        #             'subject': 'Creación de cuenta de usuario',
        #             'msg': html,
        #             'emails': [u.email]
        #         }
        #         response = send_email(body)
        #         if response['status_code'] == 400:
        #             print(response['text'])
        #             contexto['success'] = contexto['success'] + " Tuvimos un problema al notificarle al usuario vía correo electrónico."
        #         else:
        #             contexto['success'] = contexto['success'] + " Se le notificó al usuario vía correo electrónico."
        #     except:
        #         print('Error set_user', traceback.format_exc().replace('\n', ' '))
        #         contexto['success'] = contexto['success'] + " Tuvimos un problema al notificarle al usuario vía correo electrónico."

    #     return Response(contexto, status=status.HTTP_200_OK)

    # except Usuario.DoesNotExist:
    #     contexto['error'] = 'No existe usuario'
    #     return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    # except:
    #     echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_user')
    #     return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Edita el perfil Usuario
'''
/users/set_profile/
Datos enviados por el FRONT
    {
        "token": "token_autorización",

        # opcional
        "email": "email",
        "password": "password",
        "nombre": "nombre",
        "apellido_paterno": "apellido_paterno",
        "apellido_materno": "apellido_materno"
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
@api_view(['GET','POST'])
@validate_token_permission(url='set_profile')
def set_profile(request):
    contexto = {}
    try:
        u = Usuario.objects.get(tusuario_id=request.data.get('usuario_id'))

        if 'email' in request.data and request.data.get('email') and request.data['email'].strip():
            others = Usuario.objects.exclude(tusuario_id=request.data.get('usuario_id',0)).filter(email=request.data['email'].lower().strip())
            if others:
                contexto['error'] = 'Ya existe un usuario con la dirección de correo proporcionada'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
            # Set email
            u.email = request.data['email'].lower().strip()

        if 'password' in request.data and request.data.get('password') and request.data['password'].strip():
            # Guarda el password
            u.set_password(request.data['password'])

        if 'nombre' in request.data and request.data.get('nombre') and request.data['nombre'].strip():
            u.nombre = request.data['nombre'].strip()
        if 'apellido_paterno' in request.data and request.data.get('apellido_paterno') and request.data['apellido_paterno'].strip():
            u.apellido_paterno = request.data['apellido_paterno'].strip()
        if 'apellido_materno' in request.data and request.data.get('apellido_materno') and request.data['apellido_materno'].strip():
            u.apellido_materno = request.data['apellido_materno'].strip()

        u.save()
        contexto['success'] = 'Los datos del perfil se han actualizado correctamente'
        return Response(contexto, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        contexto['error'] = 'No existe usuario'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_profile')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Activar o Inactivar Usuario
'''
/users/active_user/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "id_usuario": id_usuario # esto es para editar un usuario específico
        "activar": 1/0 : 1:True 0:False
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
@api_view(['GET','POST'])
@validate_token_permission()
def active_user(request):
    contexto = {}
    try:
        u = Usuario.objects.get(tusuario_id=request.data.get('id_usuario'))
        if u:
            if int(request.data.get('activar')) == 1:
                u.is_active = True
                u.fecha_inhabilitado = None
            else:
                u.is_active = False
                u.fecha_inhabilitado = timezone.now()
            u.save()
            contexto['success'] = 'Cambio de estatus al usuario satisfactoriamente'
            return Response(contexto, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        contexto['error'] = 'No existe usuario'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'active_user')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Eliminar Usuario
'''
/users/delete_user/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "id_usuario": id_usuario # esto es para eliminar un usuario específico
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
@api_view(['GET','POST'])
@validate_token_permission()
def delete_user(request):
    contexto = {}
    try:
        user = Usuario.objects.get(tusuario_id=request.data.get('id_usuario'))
        if user:
            user.is_superuser = False
            user.is_staff = False
            user.is_active = False
            user.fecha_inhabilitado = timezone.now()
            user.email = '{}#${}'.format(user.email, random_chunk())
            user.save()
            contexto['success'] = 'Usuario eliminado satisfactoriamente'
            return Response(contexto, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        contexto['error'] = 'No existe usuario'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'delete_user')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)



######### CRUD ROLES - PERMISOS #########

# Obtiene el Listado de todos los permisos
'''
/users/get_permisos/
Datos enviados por el FRONT
    {
        "token": "token_autorización"
    }
Datos enviados por el BACK
    {
        # status 200
        "columnas": [lista de nombres de columnas],
        "permisos": [lista de diccionarios
            {cmodulo_vista_id, url, nombre, acciones}
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission()
def get_permisos(request):
    contexto = {}
    try:
        sql = """
            SELECT cmodulo_vista_id, url, nombre, acciones FROM "general".cmodulo_vista
        """
        permisos = db.get_all_pandas(sql)
        columnas = set()
        if not isinstance(permisos, bool):
            permisos['acciones'] = permisos['acciones'].apply(lambda elem: elem.split(','))
            for a in permisos['acciones']:
                columnas.update(a)
            permisos = permisos.to_dict('records')
        elif isinstance(permisos, bool):
            print("Error de consulta:\n{}".format(db.error))
            contexto['log'] = "Error de consulta:\n{}".format(db.error)
            contexto['error'] = 'No existe datos de la lista de permisos'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        contexto['columnas'] = list(columnas)
        contexto['permisos'] = permisos
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_permisos')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene la lista de Roles
'''
/users/get_roles/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
    }
Datos enviados por el BACK
    {
        # status 200
        "roles": [lista de diccionarios
            {
                "crol_id": id, "rol": "nombre_rol", "admin": True/False,
                "permisos": [lista de diccionarios {
                    "cmodulo_vista__url": "c_antecedentes",
                    "cmodulo_vista__nombre": "Gestión de Antecedentes",
                    "acciones": "crear,editar,listar"
                }]
            } 
        
        ]

        # status 400
        "log": "Error de Excepction",
        "error": "Texto de error para mostrarle al usuario en el sistema"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission()
def get_roles(request):
    contexto = {}
    try:
        roles = Crol.objects.all()
        contexto['roles'] = []
        for rol in roles:
            data = {
                'crol_id': rol.crol_id,
                'rol': rol.rol,
                'admin': rol.sudo
            }

            permisos = TpermisoRolVista.objects.exclude(acciones='').filter(crol=rol).values(
                'cmodulo_vista__url', 'cmodulo_vista__nombre', 'acciones'
            )
            data['permisos'] = permisos

            contexto['roles'].append(data)

        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_roles')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Añade o edita Rol con sus permisos
'''
/users/set_role/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "rol": "nombre del rol",
        "sudo": 1/0 : 1:True 0:False, # si no se envìa la variable por default es False

        # opcional
        "permisos": [
            {
                "cmodulo_vista_id": "cmodulo_vista_id",
                "acciones" : [lista de String de las acciones]
            }
        ] # Es opcional, pero si no tiene permisos el Rol, no debe de ver ningún Menú, sólo la pantalla de Bienvenida
        # Si no se le envían los permisos y dicho Rol los tiene, entonces se les resetean y se queda sin permisos

        # opcional - SOLO para EDITAR
        "crol_id": crol_id # esto es para editar un rol específico, sino se coloca, lo inserta
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
@api_view(['GET','POST'])
@validate_token_permission()
def set_role(request):
    contexto = {}
    try:
        crol = None
        if 'crol_id' in request.data:
            crol = Crol.objects.get(crol_id=request.data.get('crol_id'))

        if not crol:
            crol = Crol()

        if 'rol' in request.data:
            others = Crol.objects.exclude(crol_id=request.data.get('crol_id', 0)).filter(rol__icontains=request.data['rol'].strip())
            if others:
                contexto['error'] = 'Ya existe un registro con ese nombre de rol proporcionada'
                return Response(contexto, status=status.HTTP_400_BAD_REQUEST)
            # Set rol
            crol.rol = request.data['rol'].strip()
        else:
            contexto['error'] = 'Se debe de enviar el nombre del rol'
            return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

        if int(request.data.get('sudo', 0)) == 1:
            crol.sudo = True
        else:
            crol.sudo = False
        crol.save()

        # Se analizan los permisos
        permisos_r, i, permisos_id = [], 0, set()
        if (request.data.get('permisos') and request.data['permisos'] and isinstance(request.data['permisos'], list) \
            and len(request.data['permisos']) > 0
        ):
            sql = """
                SELECT cmodulo_vista_id FROM "general".cmodulo_vista
            """
            df_permisos = db.get_all_pandas(sql)
            if isinstance(df_permisos, bool):
                print('No existen dados de permisos en BD. No podremos comprobar para hacer match')
            else:
                list_ids = set(df_permisos['cmodulo_vista_id'].tolist()) # ids BD
                permisos = request.data['permisos']
                for diccionario in permisos:
                    if 'cmodulo_vista_id' in diccionario.keys():
                        if diccionario['cmodulo_vista_id'] not in list_ids or diccionario['cmodulo_vista_id'] in permisos_id:
                            del permisos[i]
                            i = i-1 if i>0 else 0
                        else:
                            permisos_id.add(diccionario['cmodulo_vista_id'])
                            permisos_r.append(diccionario)
                            i += 1
                    else:
                        del permisos[i]
                        i = i-1 if i>0 else 0

                if len(permisos_r) == 0:
                    print('No existen permisos para asignarle a este Rol')
        else:
            print('No se le asignarán permisos de este Rol')

        # Insertar/Actualizar los permisos del rol
        for dic_permiso in permisos_r:
            try:
                vista = CmoduloVista.objects.get(cmodulo_vista_id=dic_permiso['cmodulo_vista_id'])
                if vista:
                    try:
                        permiso_vista = TpermisoRolVista.objects.get(cmodulo_vista=vista, crol=crol)
                    except:
                        permiso_vista = TpermisoRolVista()
                        permiso_vista.cmodulo_vista = vista
                        permiso_vista.crol = crol

                    acciones = ''
                    if isinstance(dic_permiso.get('acciones',[]), list):
                        acciones = ','.join(dic_permiso.get('acciones',[]))
                    permiso_vista.acciones = acciones
                    permiso_vista.save()
            except:
                permisos_id.remove(dic_permiso['cmodulo_vista_id'])

        # Actualizar los id_permisos que no se enviaron por acciones vacías
        if len(permisos_id):
            sql = """
                UPDATE "general".tpermiso_rol_vista
                SET acciones = ''
                WHERE
                    crol_id = {}
                    AND cmodulo_vista_id NOT IN ({})
            """.format( crol.crol_id, str(list(permisos_id)).strip('[]') )
            db.run_query(sql, commit=True)
        else:
            sql = """
                UPDATE "general".tpermiso_rol_vista
                SET acciones = ''
                WHERE
                    crol_id = {}
            """.format( crol.crol_id )
            db.run_query(sql, commit=True)

        contexto['success'] = 'Los datos del Rol se han registrado correctamente'
        return Response(contexto, status=status.HTTP_200_OK)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'set_role')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)


# Obtiene los datos de un Rol
'''
/users/get_rol/
Datos enviados por el FRONT
    {
        "token": "token_autorización",
        "id_rol": id_rol # esto es para ver información de un rol específico
    }
Datos enviados por el BACK
    {
        # status 200
        "data": {
            'crol_id': ,
            'rol': ,
            'admin': true/false,
            "permisos": [lista de diccionarios {
                "cmodulo_vista__url": "c_antecedentes",
                "cmodulo_vista__nombre": "Gestión de Antecedentes",
                "acciones": "crear,editar,listar"
            }]
        }

        # status 400
        "error": "Texto de error para mostrarle al usuario en el sistema"
        # opcional
        "log": "Error de Excepction"
    }
'''
@api_view(['GET','POST'])
@validate_token_permission()
def get_rol(request):
    contexto = {}
    try:
        crol = Crol.objects.get(crol_id=request.data.get('id_rol'))

        contexto['data'] = {
            'crol_id': crol.crol_id,
            'rol': crol.rol,
            'admin': crol.sudo
        }
        
        permisos = TpermisoRolVista.objects.exclude(acciones='').filter(crol=crol).values(
            'cmodulo_vista__url', 'cmodulo_vista__nombre', 'acciones'
        )
        contexto['data']['permisos'] = permisos

        return Response(contexto, status=status.HTTP_200_OK)

    except Crol.DoesNotExist:
        contexto['error'] = 'No existe el rol'
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

    except:
        echo_error(contexto, traceback.format_exc().replace('\n', ' '), 'get_rol')
        return Response(contexto, status=status.HTTP_400_BAD_REQUEST)

