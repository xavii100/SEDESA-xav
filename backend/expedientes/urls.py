from django.urls import path
from django.conf.urls import url

from expedientes.views import *

urlpatterns = [

    ######### CRUD Triage #########
    url(r'get_notaMedica/', get_notaMedica, name="get_notaMedica"),


]
