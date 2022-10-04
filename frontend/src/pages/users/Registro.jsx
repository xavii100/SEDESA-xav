import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

import useAuth from '../../hooks/useAuth';
import { get_hospitales } from '../../api/catalogos';
import { insert_user, get_roles } from '../../api/users';

import { Title } from "../../components/layout/Title";
import { PlusUserIcon } from "./../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../components/layout/Container';
import { Form, ValidateInputForm, ValidateSelectForm, ValidateFloatIconForm, OptionSelectForm, SubmitButtonForm } from '../../components/layout/Form';
import { ValidInputTextForm, ValidInputPasswordForm, ValidInputEmailForm, ValidInputDateForm, ValidInputPhoneForm, ValidSelectForm } from '../../utils/FormValidation';

const FormularioRegistro = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    // const currentDate = new Date().toJSON().slice(0, 10).slice(0, 10);
    let year = new Date().toLocaleDateString("es-MX", { year:"numeric" });
    let month = new Date().toLocaleDateString("es-MX", { month:"numeric" });
    let day = new Date().toLocaleDateString("es-MX", { day:"numeric" });
    let currentDate = `${year}-${month.length == 1 ? '0'+month : month}-${day.length == 1 ? '0'+day : day}`;
    const [roles, setRoles] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [itemForm, setItemForm] = useState({
        nombre: {value: '', message: 'Escribe un nombre de usuario valido', color: '', isErr: false},
        apellido_paterno: {value: '', message: 'Escribe el apellido paterno', color: '', isErr: false},
        apellido_materno: {value: '', message: 'Escribe el apellido materno', color: '', isErr: false},
        email: {value: '', message: 'Escribe un correo electrónico válido', color: '', isErr: false},
        password: {value: '', message: '', color: '', isErr: false},
        password2: {value: '', message: '', color: '', isErr: false},
        fecha_nacimiento: {value: '', message: 'Se necesita la fecha de nacimiento', color: '', isErr: false},
        crol: {value: 0, message: 'Es necesario seleccionar un rol de usuario', color: '', isErr: false},
        thospital: {value: 0, message: 'Es necesario selecionar un hospital', color: '', isErr: false},
        curp: {value: '', message: 'Es necesario escribir la CURP', color: '', isErr: false},
        rfc: {value: '', message: 'Es necesario escribir el RFC', color: '', isErr: false},
        sexo: {value: 0, message: 'Es necesario seleccionar el sexo', color: '', isErr: false},
        telefono: {value: '', message: 'Se necesita un número de teléfono de 10 digítos continuos', color: '', isErr: false},
        cedula_profesional: {value: '', message: 'Es necesaria la cédula profesional (incluir la carrera o especialidad)', color: '', isErr: false},
        usuario_autoriza: {value: '', message: 'Es necesario el nombre de quien autoriza', color: '', isErr: false},
        cargo_usuario_autoriza: {value: '', message: 'Es necesario el cargo de quien autoriza', color: '', isErr: false},
    });
    // --------------------------------------------------------------------------------
    // validar formulario
    const nombreRef = useRef();
    const apellidoPaternoRef = useRef();
    const apellidoMaternoRef = useRef();
    const emailRef = useRef();
    const rolUsuarioRef = useRef();
    const hospitalRef = useRef();
    const passwordRef = useRef();
    const password2Ref = useRef();
    const fechaNacimientoRef = useRef();
    const sexoRef = useRef();
    const telefonoRef = useRef();
    const curpRef = useRef();
    const rfcRef = useRef();
    const cedulaProfesionalRef = useRef();
    const usuarioAutorizaRef = useRef();
    const cargoUsuarioAutorizaRef = useRef();
    // --------------------------------------------------------------------------------
    
    // --------------------------------------------------------------------------------
    // password
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShown2, setPasswordShown2] = useState(false);
    // --------------------------------------------------------------------------------

    useEffect(() => {
        // cargar todos los roles de usuario
        const getRoles = async () => {
            const { data } = await get_roles(auth);
            setRoles( () => data.roles );
        }
        
        // cargar todos los hospitales
        const getHospitals = async () => {
            const { data } = await get_hospitales(auth);
            setHospitals( () => data.hospitales );
        }

        getRoles();
        getHospitals();

    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name, type } = e.target;
        // validateForm(name, value, type)
        ValidInputTextForm(name, value, type, itemForm, setItemForm);
        ValidInputEmailForm(name, value, type, itemForm, setItemForm);
        ValidInputDateForm(name, value, type, itemForm, setItemForm);
        ValidInputPhoneForm(name, value, type, itemForm, setItemForm);
        ValidSelectForm(name, value, type, itemForm, setItemForm);
        ValidInputPasswordForm(name, value, type, itemForm, setItemForm);
    };

    const handleTogglePasswordVisiblityClick = () => {
        setPasswordShown(passwordShown ? false : true);
    }

    const handleTogglePasswordVisiblityClick2 = () => {
        setPasswordShown2(passwordShown2 ? false : true);
    }

    const  handleInsertaUsuarioSubmit = async (e) => {
        e.preventDefault();
        for (const [key, valor] of Object.entries(itemForm)) {
            if (valor.value === '') {
                switch (key) {
                    case 'nombre':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        nombreRef.current.focus();
                        break;
                    
                    case 'apellido_paterno':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        apellidoPaternoRef.current.focus();
                        break;
                    
                    case 'apellido_materno':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        apellidoMaternoRef.current.focus();
                        break;
                    
                    case 'email':
                        ValidInputEmailForm(key, valor.value, 'email', itemForm, setItemForm);
                        emailRef.current.focus();
                        break;
                    
                    case 'fecha_nacimiento':
                        ValidInputDateForm(key, valor.value, 'date', itemForm, setItemForm);
                        fechaNacimientoRef.current.focus();
                        break;
                    
                    case 'telefono':
                        ValidInputPhoneForm(key, valor.value, 'tel', itemForm, setItemForm);
                        telefonoRef.current.focus();
                        break;

                    case 'curp':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        curpRef.current.focus();
                        break;
                    
                    case 'rfc':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        rfcRef.current.focus();
                        break;
                    
                    case 'cedula_profesional':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        cedulaProfesionalRef.current.focus();
                        break;
                    
                    case 'usuario_autoriza':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        usuarioAutorizaRef.current.focus();
                        break;

                    case 'cargo_usuario_autoriza':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        cargoUsuarioAutorizaRef.current.focus();
                        break;
                    
                    case 'password':
                        ValidInputPasswordForm(key, valor.value, 'password', itemForm, setItemForm);
                        passwordRef.current.focus();
                        break;
                    
                    case 'password2':
                        ValidInputPasswordForm(key, valor.value, 'password', itemForm, setItemForm);
                        password2Ref.current.focus();
                        break;
                }
                return; // indicar para el primer campo vacío y evitar proseguir
            } else if (valor.value === 0) {
                switch (key) {
                    case 'crol':
                        ValidSelectForm(key, valor.value, 'select-one', itemForm, setItemForm);
                        rolUsuarioRef.current.focus();
                        break;
                    
                    case 'thospital':
                        ValidSelectForm(key, valor.value, 'select-one', itemForm, setItemForm);
                        hospitalRef.current.focus();
                        break;

                    case 'sexo':
                        ValidSelectForm(key, valor.value, 'select-one', itemForm, setItemForm);
                        sexoRef.current.focus();
                        break;
                }
                return; // indicar para el primer campo vacío y evitar proseguir
            }
        }

        // se puede procesar la información para ser enviada al backend
        const info = {
            token: auth.token,
            thospital: itemForm.thospital.value,
            crol: itemForm.crol.value,
            email: itemForm.email.value,
            password: itemForm.password.value,
            nombre: itemForm.nombre.value,
            apellido_paterno: itemForm.apellido_paterno.value,
            apellido_materno: itemForm.apellido_materno.value,
            fecha_nacimiento: itemForm.fecha_nacimiento.value,
            sexo: itemForm.sexo.value,
            curp: itemForm.curp.value,
            rfc: itemForm.rfc.value,
            telefono: itemForm.telefono.value,
            cedula_profesional: itemForm.cedula_profesional.value,
            usuario_autoriza: itemForm.usuario_autoriza.value,
            cargo_usuario_autoriza: itemForm.cargo_usuario_autoriza.value
        }

        if (itemForm.password.value !== itemForm.password2.value) { // los passwords no coinciden
            return; // no hacer nada y esperar a que el usuario haga coincidir los passwords
        }

        // registrar nuevo usuario
        const insertUser = async () => {
            const result = await insert_user(auth, info);
            if (result.status === 201) {
                console.log()
                document.getElementById("frmInsertarUsuario").reset();
                Swal.fire({
                    title: 'Registro de usuario',
                    position: 'center',
                    icon: 'success',
                    html: result.data.success,
                    showCancelButton: false,
                    confirmButtonText: 'Ok'
                }).then((res) => {
                    if (res.isConfirmed) { // hicieron click en "Sí"
                        navigate('/sedesa/usuarios', { replace: true });
                    }
                });
            } else {
                console.log(result)
            }
        }
        insertUser();
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Registro de usuario"
                />
                <RowsContainer columns={1} addClass="mb-4">
                    <ColumnContainer>
                    </ColumnContainer>
                </RowsContainer>
                    <Form id="frmInsertarUsuario" onSubmit={ handleInsertaUsuarioSubmit}>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    label="Nombre(s)"
                                    innerRef={ nombreRef }
                                    autoComplete="off"
                                    placeholder="Escribe el nombre o nombres"
                                    maxLength={50}
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.nombre.value }
                                    color={ itemForm.nombre.color }
                                    helpMessage={ itemForm.nombre.message }
                                    helpClass={ itemForm.nombre.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type='text'
                                    id="apellido_paterno"
                                    name="apellido_paterno"
                                    label="Apellido Paterno"
                                    innerRef={ apellidoPaternoRef }
                                    autodfdfdfsComplete="off"
                                    placeholder="Apellido Paterno"
                                    maxLength={50}
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.apellido_paterno.value }
                                    color={ itemForm.apellido_paterno.color }
                                    helpMessage={ itemForm.apellido_paterno.message }
                                    helpClass={ itemForm.apellido_paterno.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="text"
                                    id="apellido_materno"
                                    name="apellido_materno"
                                    label="Apellido Materno"
                                    innerRef={ apellidoMaternoRef }
                                    autoComplete="off"
                                    placeholder="Apellido Materno"
                                    maxLength={50}
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.apellido_materno.value }
                                    color={ itemForm.apellido_materno.color }
                                    helpMessage={ itemForm.apellido_materno.message }
                                    helpClass={ itemForm.apellido_materno.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="email"
                                    id="email"
                                    name="email"
                                    label="Correo Electrónico"
                                    innerRef={ emailRef }
                                    autoComplete="off"
                                    placeholder="usuario@dominio.com"
                                    pattern='^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$'
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.email.value }
                                    color={ itemForm.email.color }
                                    helpMessage={ itemForm.email.message }
                                    helpClass={ itemForm.email.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="date"
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    label="Fecha de Nacimiento"
                                    innerRef={ fechaNacimientoRef }
                                    autoComplete="off"
                                    min='1910-01-01'
                                    max={ currentDate }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.fecha_nacimiento.value }
                                    color={ itemForm.fecha_nacimiento.color }
                                    helpMessage={ itemForm.fecha_nacimiento.message }
                                    helpClass={ itemForm.fecha_nacimiento.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateSelectForm 
                                    id="sexo"
                                    name="sexo"
                                    label="Sexo"
                                    innerRef={ sexoRef }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.sexo.value }
                                    color={ itemForm.sexo.color }
                                    helpMessage={ itemForm.sexo.message }
                                    helpClass={ itemForm.sexo.isErr ? 'visible' : 'invisible' }
                                >
                                    <OptionSelectForm key="0" value="0" selected="true" disabled="disabled">Selecciona el sexo</OptionSelectForm>
                                    <OptionSelectForm key="1" value="M">Masculino</OptionSelectForm>
                                    <OptionSelectForm key="2" value="F">Femenino</OptionSelectForm>
                                </ValidateSelectForm>
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    label="Número de Teléfono"
                                    innerRef={ telefonoRef }
                                    autoComplete="off"
                                    maxLength={ 10 }
                                    pattern='[0-9]{10}'
                                    placeholder="10 dígitos continuos"
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.telefono.value }
                                    color={ itemForm.telefono.color }
                                    helpMessage={ itemForm.telefono.message }
                                    helpClass={ itemForm.telefono.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="text"
                                    id="curp"
                                    name="curp"
                                    label="CURP"
                                    innerRef={ curpRef }
                                    autoComplete="off"
                                    placeholder="Escribe la CURP"
                                    // pattern="[A-Za-z0-9]{14}"
                                    maxLength={ 18 }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.curp.value }
                                    color={ itemForm.curp.color }
                                    className="uppercase"
                                    helpMessage={ itemForm.curp.message }
                                    helpClass={ itemForm.curp.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="text"
                                    id="rfc"
                                    name="rfc"
                                    label="RFC"
                                    innerRef={ rfcRef }
                                    autoComplete="off"
                                    placeholder="Escribe el RFC"
                                    maxLength={ 13 }
                                    // pattern="[A-Za-z0-9]{14}"
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.rfc.value }
                                    color={ itemForm.rfc.color }
                                    className="uppercase"
                                    helpMessage={ itemForm.rfc.message }
                                    helpClass={ itemForm.rfc.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="text"
                                    id="cedula_profesional"
                                    name="cedula_profesional"
                                    label="Cédula Profesional"
                                    innerRef={ cedulaProfesionalRef }
                                    autoComplete="off"
                                    placeholder="Cédula profesional (incluir la carrera o especialidad)"
                                    maxLength={ 20 }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.cedula_profesional.value }
                                    color={ itemForm.cedula_profesional.color }
                                    helpMessage={ itemForm.cedula_profesional.message }
                                    helpClass={ itemForm.cedula_profesional.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="text"
                                    id="usuario_autoriza"
                                    name="usuario_autoriza"
                                    label="Nombre de quien autoriza"
                                    innerRef={ usuarioAutorizaRef }
                                    autoComplete="off"
                                    placeholder="Nombre completo de quien autoriza"
                                    maxLength={ 50 }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.usuario_autoriza.value }
                                    color={ itemForm.usuario_autoriza.color }
                                    helpMessage={ itemForm.usuario_autoriza.message }
                                    helpClass={ itemForm.usuario_autoriza.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateInputForm 
                                    type="text"
                                    id="cargo_usuario_autoriza"
                                    name="cargo_usuario_autoriza"
                                    label="Cargo de quien autoriza"
                                    innerRef={ cargoUsuarioAutorizaRef }
                                    autoComplete="off"
                                    placeholder="Escribe el cargo de quien autoriza"
                                    maxLength={ 50 }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.cargo_usuario_autoriza.value }
                                    color={ itemForm.cargo_usuario_autoriza.color }
                                    helpMessage={ itemForm.cargo_usuario_autoriza.message }
                                    helpClass={ itemForm.cargo_usuario_autoriza.isErr ? 'visible' : 'invisible' }
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <ValidateSelectForm 
                                    id="crol"
                                    name="crol"
                                    label="Rol de Usuario"
                                    innerRef={ rolUsuarioRef }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.crol.value }
                                    color={ itemForm.crol.color }
                                    helpMessage={ itemForm.crol.message }
                                    helpClass={ itemForm.crol.isErr ? 'visible' : 'invisible' }
                                >
                                    <OptionSelectForm key="0" value="0" selected="true" disabled="disabled">Selecciona un rol de usuario</OptionSelectForm>
                                    {roles.map(rol => {
                                        return (
                                            <OptionSelectForm 
                                                key={rol.crol_id} 
                                                id={rol.crol_id} 
                                                value={rol.crol_id}
                                            >
                                                {rol.rol}
                                            </OptionSelectForm>
                                        )
                                    })}
                                </ValidateSelectForm>
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateSelectForm 
                                    id="thospital"
                                    name="thospital"
                                    label="Hospital"
                                    innerRef={ hospitalRef }
                                    onChange={ handleUpdateFormChange }
                                    value={ itemForm.thospital.value }
                                    color={ itemForm.thospital.color }
                                    helpMessage={ itemForm.thospital.message }
                                    helpClass={ itemForm.thospital.isErr ? 'visible' : 'invisible' }
                                >
                                    <OptionSelectForm key="0" value="0" selected="true" disabled="disabled">Selecciona un hospital</OptionSelectForm>
                                    {hospitals.map(hospital => {
                                        return (
                                            <OptionSelectForm 
                                                key={hospital.thospital_id} 
                                                id={hospital.thospital_id} 
                                                value={hospital.thospital_id}
                                                >
                                                {hospital.nombre}
                                            </OptionSelectForm>
                                        )
                                    })}
                                </ValidateSelectForm>
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <ValidateFloatIconForm 
                                    type={ passwordShown ? 'text' : 'password' }
                                    id="password"
                                    name="password"
                                    label="Nueva Contraseña"
                                    innerRef={ passwordRef }
                                    autoComplete="off"
                                    placeholder="Únicamente se permiten letras y numeros"
                                    onChange={ handleUpdateFormChange }
                                    minLength={ 8 }
                                    pattern='[A-Za-z0-9]{8,}'
                                    value={ itemForm.password.value }
                                    color={ itemForm.password.color }
                                    helpMessage={ itemForm.password.message }
                                    helpClass={ itemForm.password.isErr ? 'visible' : 'invisible' }
                                    icon={ passwordShown ? 'bi bi-eye' : 'bi bi-eye-slash' }
                                    iconClass='right-3'
                                    OnClickIcon={ handleTogglePasswordVisiblityClick }
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <ValidateFloatIconForm 
                                    type={ passwordShown2 ? 'text' : 'password' }
                                    id="password2"
                                    name="password2"
                                    label="Confirmar Contraseña"
                                    innerRef={ password2Ref }
                                    autoComplete="off"
                                    placeholder="Únicamente se permiten letras y numeros"
                                    onChange={ handleUpdateFormChange }
                                    minLength={ 8 }
                                    pattern='[A-Za-z0-9]{8,}'
                                    value={ itemForm.password2.value }
                                    color={ itemForm.password2.color }
                                    helpMessage={ itemForm.password2.message }
                                    helpClass={ itemForm.password2.isErr ? 'visible' : 'invisible' }
                                    icon={ passwordShown2 ? 'bi bi-eye' : 'bi bi-eye-slash' }
                                    iconClass='right-3'
                                    OnClickIcon={ handleTogglePasswordVisiblityClick2 }
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <SubmitButtonForm>
                                    <PlusUserIcon />
                                    Registrar Usuario
                                </SubmitButtonForm>
                            </ColumnContainer>
                        </RowsContainer>
                    </Form>
            </MainContainer>
        </>
    );
};

export default FormularioRegistro;
