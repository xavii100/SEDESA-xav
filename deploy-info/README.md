# Iplementar (deploy) la aplicación SisIfoH SEDESA

## Frontend
Compilar la aplicación del `frontend` con el comando `npm run build`

## Backend
Los siguientes pasos deben realizarse para llevar a cabo el deploy de Django con la aplicación de React.


1 Por convención la carpeta previamente compilada del `frontend` `build` debe moverse dentro de la carpeta `backend`.

2 En `config/settings.py` se tienen que agregar algunas instrucciones referentes a los archivos estáticos, de este modo Django será capaz de:

Debe de especificarse la ru



`sudo nano /etc/systemd/system/gunicorn.socket`

[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target


`sudo nano /etc/systemd/system/gunicorn.service`

[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=sammy
Group=www-data
WorkingDirectory=/home/sammy/myprojectdir
ExecStart=/home/sammy/myprojectdir/myprojectenv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          myproject.wsgi:application

[Install]
WantedBy=multi-user.target


`sudo systemctl start gunicorn.socket`

`sudo systemctl enable gunicorn.socket`

verificar

`sudo systemctl status gunicorn.socket`


