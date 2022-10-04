from rest_framework import serializers

from users.models import *

from datetime import datetime, date


# prueba
class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Csintoma
        fields = ('csintoma_id', 'nombre', 'abreviatura') # fields = '__all__' si se desea gregar todos los campos.

#Paciente
class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TpacienteTriage
        fields = '__all__'

# Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

    def validate_curp(self, value):
        if len(str(value)) > 18 and not str(value).isalnum():
            raise serializers.ValidationError('No puede contener más de 18 caracteres ni caracteres no alfanuméricos')
        return str(value).upper()


    def validate_rfc(self, value):
        if len(str(value)) > 13 and not str(value).isalnum():
            raise serializers.ValidationError('No puede contener más de 13 caracteres ni caracteres no alfanuméricos')
        return str(value).upper()


    def validate_telefono(self, value):
        if len(str(value)) > 15:
            raise serializers.ValidationError('Solo admite hasta 15 caracteres')
        return str(value)


    def validate_sexo(self, value):
        if len(str(value)) > 1 and str(value).upper() not in ('M', 'F'):
            raise serializers.ValidationError('No puede contener más de un caracter y debes de indicar las letras M/F')
        return str(value).upper()


    def validate_fecha_nacimiento(self, value):
        lst_fmt = ["%Y-%m-%d","%Y/%m/%d","%d-%m-%Y","%d/%m/%Y"]

        if isinstance(value, datetime) or isinstance(value, date):
            return value

        if isinstance(value, str):
            for fmt in lst_fmt:
                try:
                    date_time = datetime.strptime(str(value), fmt)
                    return date_time.date()
                except ValueError:
                    pass

        raise serializers.ValidationError('No está en el formato correcto')


    def validate(self, data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            data['nombre'] = data['nombre'].strip()

        if 'apellido_paterno' in data and data.get('apellido_paterno') and data['apellido_paterno'].strip():
            data['apellido_paterno'] = data['apellido_paterno'].strip()

        if 'apellido_materno' in data and data.get('apellido_materno') and data['apellido_materno'].strip():
            data['apellido_materno'] = data['apellido_materno'].strip()

        if 'email' in data and data.get('email') and data['email'].strip():
            others = Usuario.objects.exclude(tusuario_id=self.context.get('id_usuario',0)).filter(email__iexact=data['email'].strip())
            if others:
                raise serializers.ValidationError('Ya existe un usuario con la dirección de correo proporcionada')
            data['email'] = data['email'].lower().strip()

        if 'password' in data and data.get('password') and data['password'].strip():
            data['password'] = data['password'].strip()

        return data


    def create(self, validated_data):
        user = Usuario(
            email = validated_data['email'],
            nombre = validated_data.get('nombre'),
            apellido_paterno = validated_data.get('apellido_paterno'),
            apellido_materno = validated_data.get('apellido_materno'),
            fecha_nacimiento = validated_data.get('fecha_nacimiento'),
            sexo = validated_data.get('sexo'),
            curp = validated_data.get('curp'),
            rfc = validated_data.get('rfc'),
            telefono = validated_data.get('telefono'),
            cedula_profesional = validated_data.get('cedula_profesional'),
            usuario_autoriza = validated_data.get('usuario_autoriza'),
            cargo_usuario_autoriza = validated_data.get('cargo_usuario_autoriza'),
            thospital = validated_data.get('thospital'),
            crol = validated_data.get('crol'),
        )

        if self.context.get('change_password') and validated_data['password']:
            user.set_password(validated_data['password'])

        user.save()
        return user


    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.apellido_paterno = validated_data.get('apellido_paterno', instance.apellido_paterno)
        instance.apellido_materno = validated_data.get('apellido_materno', instance.apellido_materno)
        instance.fecha_nacimiento = validated_data.get('fecha_nacimiento', instance.fecha_nacimiento)
        instance.sexo = validated_data.get('sexo', instance.sexo)
        instance.curp = validated_data.get('curp', instance.curp)
        instance.rfc = validated_data.get('rfc', instance.rfc)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.cedula_profesional = validated_data.get('cedula_profesional', instance.cedula_profesional)
        instance.usuario_autoriza = validated_data.get('usuario_autoriza', instance.usuario_autoriza)
        instance.cargo_usuario_autoriza = validated_data.get('cargo_usuario_autoriza', instance.cargo_usuario_autoriza)
        instance.thospital = validated_data.get('thospital', instance.thospital)
        instance.crol = validated_data.get('crol', instance.crol)

        if self.context.get('change_password') and validated_data['password']:
            instance.set_password(validated_data['password'])

        instance.save()
        return instance
