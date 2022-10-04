# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from datetime import datetime

class Thospital(models.Model):
    thospital_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255, blank=True, null=True)
    nombre_corto = models.CharField(max_length=100, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    atiende_covid19 = models.BooleanField(blank=True, null=True, default=False)
    clues = models.CharField(max_length=45, blank=True, null=True)
    cp = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'general\".\"thospital'

class Crol(models.Model):
    crol_id = models.AutoField(primary_key=True)
    rol = models.CharField(max_length=45, blank=True, null=True)
    sudo = models.BooleanField(blank=True, null=True, default=False)

    class Meta:
        managed = False
        db_table = 'general\".\"crol'


class Usuario(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # Remove fields
    username = None
    first_name = None
    last_name = None
    tusuario_id = models.AutoField(primary_key=True)
    fecha_inhabilitado = models.DateTimeField(blank=True, null=True)
    nombre = models.CharField(max_length=50, blank=True, null=True)
    apellido_paterno = models.CharField(max_length=50, blank=True, null=True)
    apellido_materno = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    sexo = models.CharField(max_length=1, blank=True, null=True)
    curp = models.CharField(max_length=18, blank=True, null=True)
    rfc = models.CharField(max_length=13, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    cedula_profesional = models.CharField(max_length=20, blank=True, null=True)
    usuario_autoriza = models.CharField(max_length=50, blank=True, null=True)
    cargo_usuario_autoriza = models.CharField(max_length=50, blank=True, null=True)
    thospital = models.ForeignKey(Thospital, models.DO_NOTHING)
    crol = models.ForeignKey(Crol, models.DO_NOTHING)

    class Meta:
        db_table = 'public\".\"usuario'

class TpacienteSami(models.Model):
    tpaciente_sami_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, blank=True, null=True)
    apellido_paterno = models.CharField(max_length=50, blank=True, null=True)
    apellido_materno = models.CharField(max_length=50, blank=True, null=True)
    edad = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    sexo = models.CharField(max_length=1, blank=True, null=True)
    estado = models.CharField(max_length=50, blank=True, null=True)
    municipio_alcaldia = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"tpaciente_sami'

class Cantecedente(models.Model):
    cantecedente_id = models.AutoField(primary_key=True)
    cantecedente_primario = models.ForeignKey('self', models.DO_NOTHING, null=True)
    nombre = models.CharField(max_length=80, blank=True, null=True)
    abreviatura = models.CharField(max_length=20, blank=True, null=True)
    sinonimos = models.CharField(max_length=1000, blank=True, null=True)
    triage = models.BooleanField(blank=True, null=True, default=False)

    class Meta:
        managed = False
        db_table = 'triage\".\"cantecedente'


class CconstanteVital(models.Model):
    cconstante_vital_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80, blank=True, null=True)
    abreviatura = models.CharField(max_length=20, blank=True, null=True)
    min = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    max = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    alerta_menor_que = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    alerta_mayor_que = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'triage\".\"cconstante_vital'

class TetlReporteHistorico(models.Model):
    tetl_reporte_historico_id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=20, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    reporte = models.CharField(max_length=50, blank=True, null=True)
    log = models.CharField(max_length=26, blank=True, null=True)
    estatus = models.CharField(max_length=10, blank=True, null=True)
    tusuario = models.ForeignKey(Usuario, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"tetl_reporte_historico'

class CespecialidadTipo(models.Model):
    cespecialidad_tipo_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45, blank=True, null=True)
    agrupar_en_otras = models.BooleanField(blank=True, null=True, default=False)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"cespecialidad_tipo'


class CestadoAlerta(models.Model):
    cestado_alerta_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80)
    abreviatura = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'triage\".\"cestado_alerta'


class CestadoAlertaOpcion(models.Model):
    cestado_alerta_opcion_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30, blank=True, null=True)
    estado_alerta = models.ForeignKey(CestadoAlerta, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'triage\".\"cestado_alerta_opcion'


class CestadoPaciente(models.Model):
    cestado_paciente_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"cestado_paciente'


class CmoduloVista(models.Model):
    cmodulo_vista_id = models.AutoField(primary_key=True)
    url = models.CharField(max_length=150)
    nombre = models.CharField(max_length=100)
    acciones = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'general\".\"cmodulo_vista'


class CmotivoAlta(models.Model):
    cmotivo_alta_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"cmotivo_alta'

class Cterapeutica(models.Model):
    cterapeutica_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'medicalrecord\".\"cterapeutica'

class CrecursoTipo(models.Model):
    crecurso_tipo_id = models.AutoField(primary_key=True)
    tipo_recurso = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"crecurso_tipo'


class CresultadoPrueba(models.Model):
    cresultado_prueba_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"cresultado_prueba'

class Csintoma(models.Model):
    csintoma_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=80, blank=True, null=True)
    abreviatura = models.CharField(max_length=30, blank=True, null=True)
    principal = models.BooleanField(blank=True, null=True, default=False)

    class Meta:
        managed = False
        db_table = 'triage\".\"csintoma'

class ThistoricoIngreso(models.Model):
    thistorico_ingreso_id = models.AutoField(primary_key=True)
    fecha_reporte = models.DateField(blank=True, null=True)
    fecha_reingreso = models.DateField(blank=True, null=True)
    fecha_alta = models.DateField(blank=True, null=True)
    tingreso = models.ForeignKey('Tingreso', models.DO_NOTHING)
    cespecialidad_tipo = models.ForeignKey(CespecialidadTipo, models.DO_NOTHING)
    cresultado_prueba = models.ForeignKey(CresultadoPrueba, models.DO_NOTHING)
    cestado_paciente = models.ForeignKey(CestadoPaciente, models.DO_NOTHING)
    cmotivo_alta = models.ForeignKey(CmotivoAlta, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"thistorico_ingreso'

class Tingreso(models.Model):
    tingreso_id = models.AutoField(primary_key=True)
    nhc = models.IntegerField()
    fecha_ingreso = models.DateField(blank=True, null=True)
    observaciones = models.CharField(max_length=11000, blank=True, null=True)
    notas = models.CharField(max_length=1000, blank=True, null=True)
    thospital = models.ForeignKey(Thospital, models.DO_NOTHING)
    tpaciente_sami = models.ForeignKey(TpacienteSami, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"tingreso'

class TpacienteTriage(models.Model):
    tpaciente_triage_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    folio = models.CharField(max_length=100, blank=True, null=True)
    fecha_registro = models.DateTimeField(blank=True, null=True, default=timezone.now)
    genero = models.CharField(max_length=1, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    fecha_inicio_sintomas = models.DateField(blank=True, null=True)
    embarazo = models.BooleanField(blank=True, null=True, default=False)
    semanas_gestacion = models.IntegerField(blank=True, null=True)
    filiacion = models.CharField(max_length=100, blank=True, null=True)
    vacuna_influenza = models.BooleanField(blank=True, null=True, default=False)
    puntaje_news2 = models.IntegerField(blank=True, null=True)
    puntaje_qsofa = models.IntegerField(blank=True, null=True)
    puntaje_glassgow = models.IntegerField(blank=True, null=True)
    sospecha_covid = models.BooleanField(blank=True, null=True, default=False)
    thospital = models.ForeignKey(Thospital, models.DO_NOTHING)
    tusuario = models.ForeignKey(Usuario, models.DO_NOTHING)
    contacto_infectado_covid = models.BooleanField(blank=True, null=True, default=False)
    fecha_contacto_infectado = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'general\".\"tpaciente_triage'


class TpermisoRolVista(models.Model):
    tpermiso_rol_vista_id = models.AutoField(primary_key=True)
    acciones = models.CharField(max_length=100, blank=True, null=True)
    cmodulo_vista = models.ForeignKey(CmoduloVista, models.DO_NOTHING)
    crol = models.ForeignKey(Crol, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'general\".\"tpermiso_rol_vista'
        unique_together = (('cmodulo_vista', 'crol'),)


class TrecursoRegistro(models.Model):
    trecurso_registro_id = models.AutoField(primary_key=True)
    hora_fecha = models.DateTimeField(blank=True, null=True)
    cantidad = models.IntegerField(blank=True, null=True)
    tusuario = models.ForeignKey(Usuario, models.DO_NOTHING)
    crecurso_tipo = models.ForeignKey(CrecursoTipo, models.DO_NOTHING)
    thospital = models.ForeignKey(Thospital, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"trecurso_registro'

class TregistroSintoma(models.Model):
    tregistro_sintoma_id = models.AutoField(primary_key=True)
    csintoma = models.ForeignKey(Csintoma, models.DO_NOTHING)
    tpaciente_triage = models.ForeignKey(TpacienteTriage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'triage\".\"tregistro_sintoma'
        unique_together = (('csintoma', 'tpaciente_triage_id'),)

class TregistroAntecedente(models.Model):
    tregistro_antecedente_id = models.AutoField(primary_key=True)
    cantecedente = models.ForeignKey(Cantecedente, models.DO_NOTHING)
    tpaciente_triage = models.ForeignKey(TpacienteTriage, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'triage\".\"tregistro_antecedente'
        unique_together = (('cantecedente', 'tpaciente_triage'),)


class TregistroConstanteVital(models.Model):
    tregistro_constante_vital_id = models.AutoField(primary_key=True)
    tpaciente_triage = models.ForeignKey(TpacienteTriage, models.DO_NOTHING)
    cconstante_vital = models.ForeignKey(CconstanteVital, models.DO_NOTHING)
    cantidad = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'triage\".\"tregistro_constante_vital'
        unique_together = (('tpaciente_triage', 'cconstante_vital'),)


class TregistroEstadoAlerta(models.Model):
    tregistro_estado_alerta_id = models.AutoField(primary_key=True)
    tpaciente_triage = models.ForeignKey(TpacienteTriage, models.DO_NOTHING)
    cestado_alerta_opcion = models.ForeignKey(CestadoAlertaOpcion, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'triage\".\"tregistro_estado_alerta'
        unique_together = (('tpaciente_triage', 'cestado_alerta_opcion'),)


class TregistroPaciente(models.Model):
    tregistro_paciente_id = models.AutoField(primary_key=True)
    fecha_registro = models.DateTimeField(blank=True, null=True)
    tusuario = models.ForeignKey(Usuario, models.DO_NOTHING)
    thospital = models.ForeignKey(Thospital, models.DO_NOTHING)
    cestado_paciente = models.ForeignKey(CestadoPaciente, models.DO_NOTHING)
    crecurso_tipo = models.ForeignKey(CrecursoTipo, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"tregistro_paciente'

class TpacienteNota(models.Model):
    tpaciente_sami_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, blank=True, null=True)
    apellido_paterno = models.CharField(max_length=50, blank=True, null=True)
    apellido_materno = models.CharField(max_length=50, blank=True, null=True)
    edad = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    sexo = models.CharField(max_length=1, blank=True, null=True)
    estado = models.CharField(max_length=50, blank=True, null=True)
    municipio_alcaldia = models.CharField(max_length=50, blank=True, null=True)
    nhc = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'medicalrecord\".\"tpaciente_nota'

class TnotaMedica(models.Model):
    detalle_paciente_sami_id = models.IntegerField(primary_key=True)
    temperatura = models.DecimalField(max_digits=2, decimal_places=2, blank=True, null=True)
    frecuencia_cardiaca = models.IntegerField(blank=True, null=True)
    frecuencia_respiratoria = models.IntegerField(blank=True, null=True)
    saturacion_oxigeno = models.IntegerField(blank=True, null=True)
    tension_arterial_sistolica = models.IntegerField(blank=True, null=True)
    tension_arterial_diastolica = models.IntegerField(blank=True, null=True)
    peso = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    altura = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    fecha_ingreso = models.DateTimeField(blank=True, null=True)
    tpaciente_nota = models.ForeignKey('TpacienteNota', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'dashboards\".\"detalle_paciente_sami'


class Cmedicamento(models.Model):
    cmedicamento_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'medicalrecord\".\"cmedicamento'

class Cvacuna(models.Model):
    cvacuna_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'triage\".\"cvacuna'

class TsintomaNota(models.Model):
    tsintoma_nota_id = models.AutoField(primary_key=True)
    csintoma = models.ForeignKey(Csintoma, models.DO_NOTHING)
    tnota_medica = models.ForeignKey(TnotaMedica, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'medicalrecord\".\"tsintoma_nota'
        unique_together = (('csintoma', 'tnota_medica'),)

class TvacunaNota(models.Model):
    tvacuna_nota_id = models.IntegerField(primary_key=True)
    vacunado = models.BooleanField()
    fecha_vacunacion = models.DateField(blank=True, null=True)
    dosis = models.CharField(max_length=40, blank=True, null=True)
    cvacuna_id = models.ForeignKey(Cvacuna, models.DO_NOTHING)
    tnota_medica = models.ForeignKey(TnotaMedica, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'medicalrecord\".\"tvacuna_nota'

class TmedicamentoNota(models.Model):
    tmedicamento_id = models.IntegerField(primary_key=True)
    cmedicamento = models.ForeignKey(Cmedicamento, models.DO_NOTHING)
    tnota_medica = models.ForeignKey(TnotaMedica, models.DO_NOTHING)
    dosis = models.DecimalField(max_digits=2, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'medicalrecord\".\"tmedicamento_nota'

class TcomorbilidadNota(models.Model):
    tcomorbilidad_nota_id = models.IntegerField(primary_key=True)
    cantecedente = models.ForeignKey(Cantecedente, models.DO_NOTHING)
    tnota_medica = models.ForeignKey(TnotaMedica, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'medicalrecord\".\"tcomorbilidad_nota'
    
class TregistroVacuna(models.Model):
    tregistro_vacuna_id = models.AutoField(primary_key=True)
    dosis = models.CharField(max_length=25)
    tpaciente_triage = models.ForeignKey(TpacienteTriage, models.DO_NOTHING)
    cvacuna = models.ForeignKey(Cvacuna, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'triage\".\"tregistro_vacuna'