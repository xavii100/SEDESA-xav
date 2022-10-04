from django.conf.urls import url

from catalogos.views import *

urlpatterns = [

    ######### CRUD Hospital #########
    url(r'get_hospitales/', get_hospitales, name="get_hospitales"),
    url(r'set_hospital/', set_hospital, name="set_hospital"),
    url(r'get_hospital/', get_hospital, name="get_hospital"),


    ######### CRUD Sintoma #########
    url(r'get_sintomas/', get_sintomas, name="get_sintomas"),
    url(r'set_sintoma/', set_sintoma, name="set_sintoma"),
    url(r'get_sintoma/', get_sintoma, name="get_sintoma"),


    ######### CRUD Constante Vital #########
    url(r'get_constantes_vitales/', get_constantes_vitales, name="get_constantes_vitales"),
    url(r'set_constante_vital/', set_constante_vital, name="set_constante_vital"),
    url(r'get_constante_vital/', get_constante_vital, name="get_constante_vital"),


    ######### CRUD Antecedentes #########
    url(r'get_antecedentes/', get_antecedentes, name="get_antecedentes"),
    url(r'set_antecedente/', set_antecedente, name="set_antecedente"),
    url(r'get_antecedente/', get_antecedente, name="get_antecedente"),


    ######### CRUD Espcecialidades #########
    url(r'get_especialidades/', get_especialidades, name="get_especialidades"),
    url(r'set_especialidad/', set_especialidad, name="set_especialidad"),
    url(r'get_especialidad/', get_especialidad, name="get_especialidad"),


    ######### CRUD Estado Alerta #########
    url(r'get_estados_alertas/', get_estados_alertas, name="get_estados_alertas"),
    url(r'set_estado_alerta/', set_estado_alerta, name="set_estado_alerta"),
    url(r'get_estado_alerta/', get_estado_alerta, name="get_estado_alerta"),


    ######### CRUD Vacunas #########
    url(r'get_vacunas/', get_vacunas, name="get_vacunas"),
    url(r'set_vacuna/', set_vacuna, name="set_vacuna"),
    url(r'get_vacuna/', get_vacuna, name="get_vacuna"),


    ######### CRUD Medicamentos #########
    url(r'get_medicamentos/', get_medicamentos, name="get_medicamentos"),
    url(r'set_medicamento/', set_medicamento, name="set_medicamento"),
    url(r'get_medicamento/', get_medicamento, name="get_medicamento"),

    ######### CRUD Motivos de alta #########
    url(r'get_motivos_alta/', get_motivos_alta, name="get_motivos_alta"),
    url(r'set_motivo_alta/', set_motivo_alta, name="set_motivo_alta"),
    url(r'get_motivo_alta/', get_motivo_alta, name="get_motivo_alta"),

    ######### CRUD Terapeutica #########
    url(r'get_terapeuticas/', get_terapeuticas, name="get_terapeuticas"),
    url(r'set_terapeutica/', set_terapeutica, name="set_terapeutica"),
    url(r'get_terapeutica/', get_terapeutica, name="get_terapeutica"),
]
