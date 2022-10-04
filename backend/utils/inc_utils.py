from django.conf import settings
from django.core.mail import EmailMessage

import re
import random
import string
import traceback


#############################################################################################
### Em este espacio colocaremos todas las funciones genéricas necesarias para el proyecto ###
#############################################################################################


'''
    Funcion para buscar un valor en un diccionario
    Uso :
        getParams(variable, 'key', valor_default)
'''
def getParam(obj, variable, default=None):
    if not obj:
        return default
    return obj[variable] if variable in obj and obj[variable] else default


'''
    Funcion para buscar valores anidados en arreglos o diccionarios
    Uso :
        getParams(variable, ('tupla', 'con', 'valores'), valor_default)
'''
def getParams( obj, keys, default=None ) :
    for k in keys :
        if k in obj :
            obj = obj[k]
        elif isinstance(obj, list) and isinstance(k, int) and len(obj) > k :
            obj = obj[k]
        else :
            return default
    return obj


# https://parzibyte.me/blog/2018/12/04/comprobar-correo-electronico-python/
# https://micro.recursospython.com/recursos/como-validar-una-direccion-de-correo-electronico.html
def is_valid_email(email):
    body_regex = re.compile('''
    ^(?!\.)                            # name may not begin with a dot
    (
      [-a-z0-9!\#$%&'*+/=?^_`{|}~]     # all legal characters except dot
      |
      (?<!\.)\.                        # single dots only
    )+
    (?<!\.)$                            # name may not end with a dot
    ''', re.VERBOSE | re.IGNORECASE)
    domain_regex = re.compile('''
        (
        localhost
        |
        (
            [a-z0-9]
                # [sub]domain begins with alphanumeric
            (
            [-\w]*                         # alphanumeric, underscore, dot, hyphen
            [a-z0-9]                       # ending alphanumeric
            )?
        \.                               # ending dot
        )+
        [a-z]{2,}                        # TLD alpha-only
    )$
    ''', re.VERBOSE | re.IGNORECASE)
    if not isinstance(email, str) or not email or '@' not in email:
        return False
    
    body, domain = email.rsplit('@', 1)

    match_body = body_regex.match(body)
    match_domain = domain_regex.match(domain)

    if not match_domain:
        # check for Internationalized Domain Names
        # see https://docs.python.org/2/library/codecs.html#module-encodings.idna
        try:
            domain_encoded = domain.encode('idna').decode('ascii')
        except UnicodeError:
            return False
        match_domain = domain_regex.match(domain_encoded)

    return (match_body is not None) and (match_domain is not None)


# Petición para enviar EMAIL
# body = {
#     # oligatorio 'subject', 'msg', 'emails'
#     # opcionales: 'name_file', 'attachment_file', 'type'
# }
def send_email(body):
    try:
        email = EmailMessage(
            body['subject'],
            body['msg'],
            settings.DEFAULT_FROM_EMAIL,
            body['emails']
        )

        if 'name_file' in body:
            if 'type' in body:
                email.attach(body['name_file'], body['attachment_file'], body['type'])
            else:
                email.attach(body['name_file'], body['attachment_file']) # application/vnd.ms-excel, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        email.content_subtype = "html"
        email.send(fail_silently=False)

        return { 'status_code': 200, 'text': 'EMAIL-- Enviado email satisfactoriamente' }

    except:
        print('EMAIL-- Error ({})'.format(traceback.format_exc().replace('\n', ' ')))
        return { 'status_code': 400, 'text': 'EMAIL-- Error ({})'.format(traceback.format_exc().replace('\n', ' ')) }


# Generar caracteres aleatorios
def random_chunk(length=10, alphabet=string.ascii_letters + string.digits):
    return ''.join(random.choice(alphabet) for i in range(length))


# Checar si un elemento de una lista se encuentra en otra lista
def elemnt_list_in_list(sublist, the_list):
    for s in sublist:
        if s in the_list:
            return True
    return False


# Función genérica para reportar errores
def echo_error(contexto, error, funcion=''):
    print('Error {} ({})'.format(funcion, error))
    contexto['log'] = 'Error {} ({})'.format(funcion, error)
    contexto['error'] = 'Ha ocurrido un error. Contacte con el administrador del Sistema'


