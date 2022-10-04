from rest_framework import serializers
from users.models import *

#Registro Sintoma
class SintomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Csintoma
        fields = ['nombre','abreviatura','principal']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate_abreviatura(self, value):
        return str(value).strip().upper()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = Csintoma.objects.exclude(csintoma_id=self.context.get('sintoma_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre del síntoma, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        if 'abreviatura' in data and data.get('abreviatura') and data['abreviatura'].strip():
            others = Csintoma.objects.exclude(csintoma_id=self.context.get('sintoma_id',0)).filter(abreviatura__iexact=data['abreviatura'].strip())
            if others:
                raise serializers.ValidationError('La abreviatura ya se encuentra asignada a otro síntoma')
            data['abreviatura'] = data['abreviatura'].strip().upper()

        return data

    def create(self, validated_data):
        return Csintoma.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.abreviatura = validated_data.get('abreviatura', instance.abreviatura)
        instance.principal = validated_data.get('principal', instance.principal)
        instance.save()
        return instance

#Registro Especialidad Tipo
class EspecialidadTipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CespecialidadTipo
        fields = ['nombre','agrupar_en_otras']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = CespecialidadTipo.objects.exclude(cespecialidad_tipo_id=self.context.get('especialidad_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre de la especialidad, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        return data

    def create(self, validated_data):
        return CespecialidadTipo.objects.create(**validated_data)
            
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.agrupar_en_otras = validated_data.get('agrupar_en_otras', instance.agrupar_en_otras)
        instance.save()
        return instance

#Registro Hospital
class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thospital
        fields = ['nombre','nombre_corto','direccion','atiende_covid19','clues','cp']

    def validate_cp(self,value):
        tam = len(str(value))
        if tam > 5:
            raise serializers.ValidationError('Error, el código postal no puede contener más de 5 caracteres')
        return value

    def validate_nombre(self, value):
        return str(value).strip().upper()

    def validate_nombre_corto(self, value):
        return str(value).strip()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = Thospital.objects.exclude(thospital_id=self.context.get('hospital_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('Ya existe un hospital con ese nombre proporcionado')
            data['nombre'] = data['nombre'].upper().strip()

        if 'nombre_corto' in data and data.get('nombre_corto') and data['nombre_corto'].strip():
            others = Thospital.objects.exclude(thospital_id=self.context.get('hospital_id',0)).filter(nombre_corto__iexact=data['nombre_corto'].strip())
            if others:
                raise serializers.ValidationError('El nombre corto ya se encuentra asignado a otro hospital')
            data['nombre_corto'] = data['nombre_corto'].strip()

        return data

    def create(self, validated_data):
        return Thospital.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.nombre_corto = validated_data.get('nombre_corto', instance.nombre_corto)
        instance.direccion = validated_data.get('direccion', instance.direccion)
        instance.atiende_covid19 = validated_data.get('atiende_covid19', instance.atiende_covid19)
        instance.clues = validated_data.get('clues', instance.clues)
        instance.cp = validated_data.get('cp', instance.cp)
        instance.save()
        return instance

#Registro Estado Alerta
class EstadoAlertaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CestadoAlerta
        fields = ['nombre','abreviatura']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate_abreviatura(self, value):
        return str(value).strip().upper()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = CestadoAlerta.objects.exclude(cestado_alerta_id=self.context.get('estado_alerta_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre del estado alerta, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        if 'abreviatura' in data and data.get('abreviatura') and data['abreviatura'].strip():
            others = CestadoAlerta.objects.exclude(cestado_alerta_id=self.context.get('estado_alerta_id',0)).filter(abreviatura__iexact=data['abreviatura'].strip())
            if others:
                raise serializers.ValidationError('La abreviatura ya se encuentra asignada a otro estado de alerta')
            data['abreviatura'] = data['abreviatura'].strip().upper()

        return data

    def create(self, validated_data):
        return CestadoAlerta.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.abreviatura = validated_data.get('abreviatura', instance.abreviatura)
        instance.save()
        return instance

#Registro Antecedente
class AntecedenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cantecedente
        fields = ['nombre','abreviatura','sinonimos','triage','cantecedente_primario']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate_abreviatura(self, value):
        return str(value).strip()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = Cantecedente.objects.exclude(cantecedente_id=self.context.get('antecedente_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre del antecedente, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        if 'abreviatura' in data and data.get('abreviatura') and data['abreviatura'].strip():
            others = Cantecedente.objects.exclude(cantecedente_id=self.context.get('antecedente_id',0)).filter(abreviatura__iexact=data['abreviatura'].strip())
            if others:
                raise serializers.ValidationError('La abreviatura ya se encuentra asignada a otro antecedente')
            data['abreviatura'] = data['abreviatura'].strip()

    def create(self, validated_data):
        return Cantecedente.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.abreviatura = validated_data.get('abreviatura', instance.abreviatura)
        instance.sinonimos = validated_data.get('sinonimos', instance.sinonimos)
        instance.triage = validated_data.get('triage', instance.triage)
        instance.cantecedente_primario = validated_data.get('cantecedente_primario', instance.cantecedente_primario)
        instance.save()
        return instance

#Registro Constante Vital
class ConstanteVitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CconstanteVital
        fields = ['nombre','abreviatura','min','max','alerta_menor_que','alerta_mayor_que']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate_abreviatura(self, value):
        return str(value).strip().upper()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = CconstanteVital.objects.exclude(cconstante_vital_id=self.context.get('constante_vital_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre de la constante vital, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        if 'abreviatura' in data and data.get('abreviatura') and data['abreviatura'].strip():
            others = CconstanteVital.objects.exclude(cconstante_vital_id=self.context.get('constante_vital_id',0)).filter(abreviatura__iexact=data['abreviatura'].strip())
            if others:
                raise serializers.ValidationError('La abreviatura ya se encuentra asignada a otro constante vital')
            data['abreviatura'] = data['abreviatura'].strip().upper()

    def create(self, validated_data):
        return CconstanteVital.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.abreviatura = validated_data.get('abreviatura', instance.abreviatura)
        instance.min = validated_data.get('min', instance.min)
        instance.max = validated_data.get('max', instance.max)
        instance.alerta_menor_que = validated_data.get('alerta_menor_que', instance.alerta_menor_que)
        instance.alerta_mayor_que = validated_data.get('alerta_mayor_que', instance.alerta_mayor_que)
        instance.save()
        return instance

#Registro Vacuna
class VacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cvacuna
        fields = ['nombre']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = Cvacuna.objects.exclude(cvacuna_id=self.context.get('vacuna_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre de la vacuna, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        return data

    def create(self, validated_data):
        return Cvacuna.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.save()
        return instance

#Registro Medicamento
class MedicamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cmedicamento
        fields = ['nombre']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = Cmedicamento.objects.exclude(cmedicamento_id=self.context.get('medicamento_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre del medicamento, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        return data

    def create(self, validated_data):
        return Cmedicamento.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.save()
        return instance

#Registro Motivo Alta
class MotivoAltaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CmotivoAlta
        fields = ['nombre']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = CmotivoAlta.objects.exclude(cmotivo_alta_id=self.context.get('motivo_alta_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre del motivo de alta, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        return data

    def create(self, validated_data):
        return CmotivoAlta.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.save()
        return instance

#Registro Terapeutica
class TerapeuticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cterapeutica
        fields = ['nombre']

    def validate_nombre(self, value):
        return str(value).strip()

    def validate(self,data):
        if 'nombre' in data and data.get('nombre') and data['nombre'].strip():
            others = Cterapeutica.objects.exclude(cterapeutica_id=self.context.get('terapeutica_id',0)).filter(nombre__iexact=data['nombre'].strip())
            if others:
                raise serializers.ValidationError('El nombre del registro de terapéutica, ya existe en la base de datos')
            data['nombre'] = data['nombre'].strip()

        return data

    def create(self, validated_data):
        return Cterapeutica.objects.create(**validated_data)
        
    def update(self,instance,validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.save()
        return instance