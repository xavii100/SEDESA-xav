from django.urls import path
from django.conf.urls import url

from triage.views import *

urlpatterns = [

    ######### CRUD Triage #########
    url(r'get_carga_formulario/', get_carga_formulario, name="get_carga_formulario"),
    url(r'set_crea_formulario/', set_crea_formulario, name="set_crea_formulario"),

    url(r'get_pacientes/', get_pacientes, name="get_pacientes"),
    url(r'get_detalle_paciente/', get_detalle_paciente, name="get_detalle_paciente"),


    ######### Ejemplo de Prueba #########
    # path('test/', test, name="test"),
    # path('test/<int:csintoma_id>/', test_detail, name="detail"),

]
