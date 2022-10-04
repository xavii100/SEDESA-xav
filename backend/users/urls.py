from django.conf.urls import url

from users.views import *
from users.auth_views import *

urlpatterns = [

    ######### AUTHORIZATION #########
    url(r'login/', doLogin, name="doLogin"),
    url(r'logout/', doLogout, name='logout'),


    ######### CRUD USUARIOS #########
    url(r'get_users/', get_users, name="get_users"),
    url(r'get_user/', get_user, name="get_user"),
    url(r'set_user/', set_user, name="set_user"),
    url(r'set_profile/', set_profile, name="set_profile"),
    url(r'active_user/', active_user, name="active_user"),
    url(r'delete_user/', delete_user, name="delete_user"),


    ######### CRUD PERMISOS - ROLES #########
    url(r'get_permisos/', get_permisos, name="get_permisos"),
    url(r'get_roles/', get_roles, name="get_roles"),
    url(r'set_role/', set_role, name="set_role"),
    url(r'get_rol/', get_rol, name="get_rol"),

]
