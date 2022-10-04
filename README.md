# SI-SEDESA Web App

## Descripción general

SI-SEDESA es una aplicación web con una interfaz gráfica desarrollada con _React 18_ para darle un dinámismo de última generación al _frontend_, mientras que el _backend_ está desarrollado con _Django 3_ para:

- Poder intergrar algoritmos de _Machine Learning_, _Natural Language Processing_ y todo lo que podamos requerir y de lo cual nos provee _Python_.
- Tener un manejo sencillo y seguro de autenticación.
- Armar una estructura cómoda e inteligible de modelos.
- Y finalmente, para tener una forma sencilla de conectarnos con el _frontend_ por medio de _Django Rest Framework_ al crear _endpoints_ de comunicación.

El motivo principal de esta aplicación es almacenar datos de información hospitalaria administrada por la Secretaría de Salud de la Ciudad de México (SEDESA).

<!-- Falta información y corroborar -->

## Despliegue local

Aunque tenemos dos carpetas principales: `backend` y `frontend`, solamente el backend debe ser ejecutado, en el frontend lo único que vamos a hacer es desarrollar por componentes modularizados, darles estilo a los elementos y una vez listo compilar todo en un _build_ que será realmente el que _Django_ utilizará.

1. Dicho eso, lo primero será clonar este repositorio con el comando: `git clone git@github.com:GI-isca-iimas/SI-SEDESA.git`. Recomendamos fuertemente que se utilice _SSH_ y no _HTTPS_ por cuestiones de seguridad y comodidad al trabajar.

2. Entra a la carpeta `frontend` y ejecuta: `npm i` para instalar todas las dependencias de _Node_. !Eso es todo! Ahora ya puedes ponerte a trabajar en el _frontend_. 🤓

3. Para visualizar todo tu trabajo primero tendrás que crear el _bundler_ de toda la compilación a _Javascript_ crudo. Simplemente ejecuta `npm run build` si estás en _Linux_ o `npm run build:windows` si estás en _Windows_.

4. Ahora hay que salir a la carpeta raíz y crear un ambiente virtual. Aquí puedes utilizar el manejador de ambientes virtuales que más te guste: _env_, _pipenv_...

5. A continuación entra al ambiente virtual y dentro de la carpeta `backend` ejecuta `pip install -r requirements.txt`.

6. Debes copiar el archivo `enviroment.example.env` dentro de la carpeta `backend` y reenombrarlo con nombre: `enviroment.env` y dentro de dicho archivo debes de colocar las credenciales de cada una de las variables del entorno que ahí se especifican. El sistema cuenta con la librería de `django-environ` que nos ayuda a cargar al ambiente virtual y a la ejecución de Django obtener dichas variables del entorno a partir del archivo.
<!-- 6. Debes de tener en tu sistema operativo cargadas las variables del entorno con sus credenciales. Por este motivo, se utiliza el archivo `enviroment.example.env` en el que aparecerán los nombres de las variables de entorno que el proyecto necesita. -->

<!-- 7. Después los comandos `python manage.py makemigrations` y `python manage.py migrate`. Eso es para que _Django_ cree las migraciones de los modelos y luego los propage respectivamente. -->

7. Finalmente ejecuta el _backend_ (que leera por defecto la carpeta compilada del _frontend_) con el comando `python manage.py runserver --insecure`. Ve a http://127.0.0.1:8000/ y podrás ver el sitio desplegado en local. 🙌

## Despliegue usando Docker

1. Sobre la raíz del proyecto guardar un archivo llamado `enviroment.env` en el que contenga las variables del entorno y sus credenciales. Por este motivo, se utiliza el archivo `enviroment.example.env` en el que aparecerán los nombres de las variables de entorno que el proyecto necesita, las cuales debes de guardarlas en el archivo `enviroment.env` y colocarles tus credenciales.

2. Ejecutar la terminal sobre la carpeta del proyecto y ejecutar el comando `docker-compose up --build --remove-orphans`
