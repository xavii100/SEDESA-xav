"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include
from django.conf.urls import url

from django.shortcuts import render
def front(request, url=''):
    context = { }
    return render(request, "index.html", context)   

urlpatterns = [

    ### RUTAS FRONT ###
    url(r'sedesa/(?P<url>.*)', front, name="front"),
    url(r'admin/', admin.site.urls),

    ### ENDPONTS ###
    url(r'catalogos/', include(('catalogos.urls', 'api'), namespace='catalogos')),
    url(r'etl/', include(('etl.urls', 'api'), namespace='etl')),
    url(r'tableros/', include(('tableros.urls', 'api'), namespace='tableros')),
    url(r'triage/', include(('triage.urls', 'api'), namespace='triage')),
    url(r'users/', include(('users.urls', 'api'), namespace='users')),
    url(r'expedientes/', include(('expedientes.urls', 'api'), namespace='expedientes')),

]
