FROM node:16.13.1

ENV PYTHONUNBUFFERED 1
# ENV PYTHONPYCACHEPREFIX="/.cache/cpython/"

RUN mkdir /code
WORKDIR /code

# COPY ./ /code/
ADD ./ /code/

WORKDIR /code/frontend/
RUN npm install && npm run build

FROM python:3.9

WORKDIR /code
ADD ./backend/requirements.txt /code/requirements.txt
RUN python -m pip install --upgrade pip && pip install -r requirements.txt

# ENTRYPOINT [ "./entrypoint.sh" ]

WORKDIR /code/backend/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
# CMD ["python", "manage.py", "runserver", "--insecure", "0.0.0.0:8000"]
