from django.db import connections

import psycopg2
import psycopg2.extras
import os
import pandas as pd

class Database:
    def __init__(self, conn_name='default'):
        self.conn = None
        self.name = conn_name

    def __str__(self):
        open = "close" if self.conn is None or self.conn.closed else "open"
        return self.name + ' / ' + open
            
    def open_connection(self):
        try:
            # Conector
            if self.conn is None or self.conn.closed:
                self.conn = connections[self.name].cursor().connection
        except Exception as e:
            self.error = "ERROR: Could not connect to Postgres. ({})".format(e)
            print(self.error)

    def close_connection(self):
        try:
            if self.conn is not None:
                self.conn.close()
        except Exception as e:
            self.error = "ERROR: Close connection ({})".format(e)
            print(self.error)

    # Permite hacer inserción hacia la BD
    # table: a la tabla a insertar
    # data: diccionario con llave "nombre de la columna" y valor el "valor correspondiente para esa columna"
    def insert(self, table, data, getid=False):
        self.open_connection()
        try:
            id = None
            keys = data.keys()
            columns = ','.join(keys)
            values  = ','.join(['%({})s'.format(k) for k in keys])
            returning = "RETURNING id" if getid else ""
            insert  = 'INSERT INTO {} ({}) values ({}) {}'.format(table, columns, values, returning)
            with self.conn.cursor() as cur:
                #print( cur.mogrify(insert, data) )
                cur.execute(insert, data)
                if getid :
                    id = cur.fetchone()[0]
                self.conn.commit()
                cur.close()
                return id if getid else True
        except Exception as e:
            self.error = "ERROR: Insert method - ({})".format(e)
            print(self.error)
        return False
    
    # Permite hacer una inserción múltiple, y si existe elemento en la BD a partir de un contrain-key los actualiza
    # table: tabla a insertar
    # keys: nombre de las columnas de la tabla a insertar
    # datas: array de arrays con todos los valores en el orden colocado en la variable anterior
    # conflict: las columnas que son contrain-key en la BD
    def insert_many_update(self, table, keys, datas, conflict):
        self.open_connection()
        try:
            columns = ','.join(keys)
            d_values = ','.join([str(d) if len(d)!=1 else '({})'.format(d[0]) for d in datas])
            columns_conflict = ','.join(conflict)
            set_update_columns = ', '.join('{key} = EXCLUDED.{key}'.format(key=k) for k in keys)
            insert = 'INSERT INTO {} as t ({}) VALUES {} ON CONFLICT ({}) DO UPDATE SET {}'.format(table, columns, d_values, columns_conflict, set_update_columns)
            insert = insert.replace('None', 'null')
            with self.conn.cursor() as cur:
                print(cur.mogrify(insert))
                cur.execute(insert)
                self.conn.commit()
                print('Number of rows {} - {}'.format(cur.rowcount, len(datas)))
                cur.close()
                return True, None
        except psycopg2.errors.CardinalityViolation:
            return False, 'Error: No se pueden insertar los datos proporcionados por Duplicidad'
        except Exception as e:
            self.error = "ERROR: Insert Many Update method - An exception of type {0} occurred. Arguments:\n{1!r}\n".format(type(e).__name__, e.args)
            print(self.error)
        return False, self.error

    # Permite hacer update hacia la BD
    # table: a la tabla a actualizar
    # data: diccionario con llave "nombre de la columna" y valor el "valor correspondiente para esa columna" a actualizar
    # where: diccionario con llave "nombre de la columna" y valor el "valor correspondiente para esa columna" condicional de la cláusula WHERE
    def update(self, table, data, where):
        self.open_connection()
        try:
            keys = data.keys()
            sql_columns = ',' . join(['{} = %({})s'.format(k,k) for k in keys])
            where_keys = where.keys()
            sql_filter  = ' AND ' . join(['{} = %(where_{})s'.format(c,c) for c  in where_keys])
            for c in where_keys:
                data['where_{}'.format(c)] = where[c]
            update = "UPDATE {} SET {} WHERE {}".format(table, sql_columns, sql_filter)
            with self.conn.cursor() as cur:
                print( 'query_processs', cur.mogrify(update, data) )
                cur.execute(update, data)
                self.conn.commit()
                cur.close()
                return True
        except Exception as e:
            self.error = "ERROR: Update method - ({})".format(e)
            print(self.error)
        return False

    # Permite ejecutar un query
    def run_query(self, query, commit=False):
        try:
            self.open_connection()
            with self.conn.cursor() as cur:
                cur.execute(query)
                if commit:
                    self.conn.commit()
                cur.close()
                return True
        except Exception as e:
            self.error = "ERROR: run_query method - ({})".format(e)
            print(self.error)
        return False

    # Permite ejecutar un query pero obtener todos los valores
    # query: String con la consulta SQL
    # data: array de los elementos condicionales que dentro del String anterior colocarías con %s
    # Retorna un Array de diccionarios
    def get_all(self, query, data=[]):
        self.open_connection()
        sql = None
        try:
            with self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                sql = cur.mogrify(query, data)
                cur.execute(query, data)
                result = cur.fetchall()
                cur.close()
                return result
        except Exception as e:
            self.error = "ERROR: get_all method - ({})".format(e)
            print( sql )
            print(self.error)
        return False


    # Permite ejecutar un query pero obtener el primer registro de la consulta - es como un LIMIT 1
    # query: String con la consulta SQL
    # data: array de los elementos condicionales que dentro del String anterior colocarías con %s
    # Retorna un Array de diccionario
    def fetchone(self, query, data=[]):
        self.open_connection()
        try:
            with self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(query, data)
                # columns = list(cur.description)
                row = cur.fetchone()
                cur.close()
                return row
        except Exception as e:
            self.error = "ERROR: fetchone method - ({})".format(e)
            print(self.error)
        return False

    # Permite ejecutar un query pero obtener todos los valores
    # query: String con la consulta SQL
    # data: array de los elementos condicionales que dentro del String anterior colocarías con %s
    # chunksize: hace la consulta por pequeños intervalos para no sobrecargar la memoria ni esperar todos los resultados en una sola llamada
    # Retorna DataFrame de Pandas
    def get_all_pandas(self, query, data=[], chunksize=None):
        """Esta funcion ejecuta query y devuelve un DataFrame de pandas"""
        self.open_connection()
        try:
            if chunksize:
                dfs = []
                for chunk in pd.read_sql_query(query, self.conn, params=data, chunksize=chunksize):
                    dfs.append(chunk)
                result = pd.concat(dfs)
            else:
                result = pd.read_sql_query(query, self.conn, params=data)
            return result
        except Exception as e:
            self.error = "ERROR: get_all_pandas method - ({})".format(e)
            print(self.error)
        return False

    # Permite hacer delete hacia la BD
    # table: a la tabla a eliminar los datos
    # where: diccionario con llave "nombre de la columna" y valor el "valor correspondiente para esa columna" condicional de la cláusula WHERE
    def delete(self, table, where):
        self.open_connection()
        try:
            data = {}
            where_keys = where.keys()
            sql_filter  = ' AND ' . join(['{} = %(where_{})s'.format(c,c) for c in where_keys])
            for c in where_keys:
                data['where_{}'.format(c)] = where[c]
            delete = "DELETE FROM {} WHERE {}".format(table, sql_filter)
            with self.conn.cursor() as cur:
                cur.execute(delete, data)
                self.conn.commit()
                cur.close()
                return True
        except Exception as e:
            self.error = "ERROR: Delete method - ({})".format(e)
            print(self.error)
        return False
