from django.conf.urls import url

from etl.views import *

urlpatterns = [
    ######### CRUD Hospital #########
    url(r'get_bitacora/', get_bitacora, name="get_bitacora"),
]

