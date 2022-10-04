import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode';

import useAuth from '../../hooks/useAuth';
import { get_hospitales } from '../../api/catalogos';
import { edit_user, get_user, get_roles } from '../../api/users';

import { Title } from "../../components/layout/Title";
import { MainContainer, RowsContainer, ColumnContainer } from '../../components/layout/Container';
import { Form, ValidateInputForm, ValidateSelectForm, ValidateFloatIconForm, OptionSelectForm, SubmitButtonForm } from '../../components/layout/Form';
import { ValidInputTextForm, ValidInputPasswordForm, ValidInputEmailForm, ValidInputDateForm, ValidInputPhoneForm, ValidSelectForm } from '../../utils/FormValidation';

const EditarUsuario = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { userid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    let year = new Date().toLocaleDateString("es-MX", { year:"numeric" });
    let month = new Date().toLocaleDateString("es-MX", { month:"numeric" });
    let day = new Date().toLocaleDateString("es-MX", { day:"numeric" });
    let currentDate = `${year}-${month.length == 1 ? '0'+month : month}-${day.length == 1 ? '0'+day : day}`;
    const [roles, setRoles] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [sudo, setSudo] = useState(false);
    const [itemForm, setItemForm] = useState({
        usuario_id: {value: 0},
        nombre: {value: ''},
        apellido_paterno: {value: ''},
        apellido_materno: {value: ''},
        email: {value: ''},
        password: {value: ''},
        password2: {value: ''},
        fecha_nacimiento: {value: ''},
        rol_id: {value: 0},
        rol: {value: ''},
        hospital_id: {value: 0},
        hospital: {value: ''},
        curp: {value: ''},
        rfc: {value: ''},
        sexo: {value: ''},
        telefono: {value: ''},
        cedula_profesional: {value: ''},
        usuario_autoriza: {value: ''},
        cargo_usuario_autoriza: {value: ''},
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
        // cargar datos del usuario logeado
        const getUserProfile = async () => {
            const { data } = await get_user({token: auth.token, id_user: userid});
            setSudo(data.data.admin) // establecer si el usuario es sudo
            setItemForm({
                usuario_id: {value: data.data.usuario_id, message: '', color: '', isErr: false},
                nombre: {value: data.data.nombre, message: 'Escribe un nombre de usuario valido', color: data.data.nombre !== null ? 'green' : 'red', isErr: data.data.nombre === null},
                apellido_paterno: {value: data.data.apellido_paterno, message: 'Escribe el apellido paterno', color: data.data.apellido_paterno !== null ? 'green' : 'red', isErr: data.data.apellido_paterno === null},
                apellido_materno: {value: data.data.apellido_materno, message: 'Escribe el apellido materno', color: data.data.apellido_materno !== null ? 'green' : 'red', isErr: data.data.apellido_materno === null},
                email: {value: data.data.email, message: 'Escribe un correo electrónico válido', color: data.data.email !== null ? 'green' : 'red', isErr: data.data.email === null},
                password: {value: '', message: '', color: '', isErr: false},
                password2: {value: '', message: '', color: '', isErr: false},
                fecha_nacimiento: {value: data.data.fecha_nacimiento, message: 'Se necesita la fecha de nacimiento', color: data.data.fecha_nacimiento !== null ? 'green' : 'red', isErr: data.data.fecha_nacimiento === null},
                rol_id: {value: data.data.rol_id, message: 'Es necesario seleccionar un rol de usuario', color: 'green', isErr: false},
                rol: {value: data.data.rol, message: '', color: 'green', isErr: false},
                hospital: {value: data.data.hospital, message: '', color: 'green', isErr: false},
                hospital_id: {value: data.data.hospital_id, message: 'Es necesario selecionar un hospital', color: 'green', isErr: false},
                curp: {value: data.data.curp, message: 'Es necesario escribir la CURP', color: data.data.curp !== null ? 'green' : 'red', isErr: data.data.curp === null},
                rfc: {value: data.data.rfc, message: 'Es necesario escribir el RFC', color: data.data.rfc !== null ? 'green' : 'red', isErr: data.data.rfc === null},
                sexo: {value: data.data.sexo, message: 'Es necesario seleccionar el sexo', color: data.data.sexo !== null ? 'green' : 'red', isErr: data.data.sexo === null},
                telefono: {value: data.data.telefono, message: 'Se necesita un número de teléfono de 10 digítos continuos', color: data.data.telefono !== null ? 'green' : 'red', isErr: data.data.telefono === null},
                cedula_profesional: {value: data.data.cedula_profesional, message: 'Es necesaria la cédula profesional (incluir la carrera o especialidad)', color: data.data.cedula_profesional !== null ? 'green' : 'red', isErr: data.data.cedula_profesional === null},
                usuario_autoriza: {value: data.data.usuario_autoriza, message: 'Es necesario el nombre de quien autoriza', color: data.data.usuario_autoriza !== null ? 'green' : 'red', isErr: data.data.usuario_autoriza === null},
                cargo_usuario_autoriza: {value: data.data.cargo_usuario_autoriza, message: 'Es necesario el cargo de quien autoriza', color: data.data.cargo_usuario_autoriza !== null ? 'green' : 'red', isErr: data.data.cargo_usuario_autoriza === null},
            });
        }

        // cargar todos los roles de usuario, solo permitido para el Administrador
        const getRoles = async () => {
            const { data } = await get_roles(auth);
            setRoles( () => data.roles );
        }
        
        // cargar todos los hospitales, solo permitido para el Administrador
        const getHospitals = async () => {
            const { data } = await get_hospitales(auth);
            setHospitals( () => data.hospitales );
        }
        
        getUserProfile();
    
        // esta acción solo es válida para el administrador
        if ( jwt_decode(auth.token).admin ) {
            getRoles();
            getHospitals();
        }
        
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name, type } = e.target;
        ValidInputTextForm(name, value, type, itemForm, setItemForm);
        ValidInputPasswordForm(name, value, type, itemForm, setItemForm);
        ValidInputEmailForm(name, value, type, itemForm, setItemForm);
        ValidInputDateForm(name, value, type, itemForm, setItemForm);
        ValidInputPhoneForm(name, value, type, itemForm, setItemForm);
        ValidSelectForm(name, value, type, itemForm, setItemForm);
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
                if (key == 'password' && valor.value === '' && itemForm.password2.value === '') continue
                if (key == 'password2' && valor.value === '' && itemForm.password.value === '') continue

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
                    
                    case 'password':
                        ValidInputPasswordForm(key, valor.value, 'password', itemForm, setItemForm);
                        passwordRef.current.focus();
                        break;
                        
                        case 'password2':
                        ValidInputPasswordForm(key, valor.value, 'password', itemForm, setItemForm);
                        password2Ref.current.focus();
                        break;
                    
                    case 'fecha_nacimiento':
                        ValidInputDateForm(key, valor.value, 'date', itemForm, setItemForm);
                        fechaNacimientoRef.current.focus();
                        break;
                    
                    case 'curp':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        curpRef.current.focus();
                        break;
                    
                    case 'rfc':
                        ValidInputTextForm(key, valor.value, 'text', itemForm, setItemForm);
                        rfcRef.current.focus();
                        break;
                    
                    case 'telefono':
                        ValidInputPhoneForm(key, valor.value, 'tel', itemForm, setItemForm);
                        telefonoRef.current.focus();
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
                }
                return; // indicar para el primer campo vacío y evitar proseguir
            } else if (valor.value === 0) {
                switch (key) {
                    case 'rol_id':
                        ValidSelectForm(key, valor.value, 'select-one', itemForm, setItemForm);
                        rolUsuarioRef.current.focus();
                        break;
                    
                    case 'hospital_id':
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
            id_usuario: itemForm.usuario_id.value,
            thospital: itemForm.hospital_id.value,
            crol: itemForm.rol_id.value,
            email: itemForm.email.value,
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
            cargo_usuario_autoriza: itemForm.cargo_usuario_autoriza.value,
            password: itemForm.password.value,
        }

        // verificar si es que se desea actualizar el password
        if (itemForm.password.value === '' && itemForm.password2.value === '') { // se intenta actualizar el password
            delete info['password']; // no se actualiza el password, no es necesario enviarlo
        } else {
            if (itemForm.password.value !== itemForm.password2.value) { // los passwords no coinciden
                return; // no hacer nada y esperar a que el usuario haga coincidir los passwords
            }
        }

        // metodo para registrar nuevo usuario
        const editUserProcess = async () => {
            const result = await edit_user(auth, info);
            if (result.status === 201) {
                document.getElementById("frmEditarUsuario").reset();
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
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrio un error al editar al usuario',
                    text: result?.data?.error,
                    // footer: '<a href="">Why do I have this issue?</a>'
                })
            }
        }

        editUserProcess();

    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualizar Información del usuario"
                />
                <RowsContainer columns={1} addClass="mb-4">
                    <ColumnContainer>
                    </ColumnContainer>
                </RowsContainer>
                    <Form id="frmEditarUsuario" onSubmit={ handleInsertaUsuarioSubmit}>
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
                                    // pattern="[A-Za-z0-9]{18}"
                                    maxLength={18}
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
                                    maxLength={13}
                                    // pattern="[A-Za-z0-9]{13}"
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
                                    maxLength={20}
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
                                    maxLength={50}
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
                                    maxLength={50}
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
                                {jwt_decode(auth.token).admin
                                ?
                                    <ValidateSelectForm 
                                        id="rol_id"
                                        name="rol_id"
                                        label="Rol de Usuario"
                                        innerRef={ rolUsuarioRef }
                                        onChange={ handleUpdateFormChange }
                                        value={ itemForm.rol_id.value }
                                        color={ itemForm.rol_id.color }
                                        helpMessage={ itemForm.rol_id.message }
                                        helpClass={ itemForm.rol_id.isErr ? 'visible' : 'invisible' }
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
                                : 
                                    <ValidateInputForm 
                                        type="text"
                                        id="rol"
                                        name="rol"
                                        label="Rol de Usuario"
                                        innerRef={ rolUsuarioRef }
                                        value={ itemForm.rol.value }
                                        color={ itemForm.rol.color }
                                        helpMessage={ itemForm.rol.message }
                                        disabled="disabled"
                                    />
                                }
                            </ColumnContainer>
                            <ColumnContainer>
                                {jwt_decode(auth.token).admin
                                ?
                                    <ValidateSelectForm 
                                        id="hospital_id"
                                        name="hospital_id"
                                        label="Hospital"
                                        innerRef={ hospitalRef }
                                        onChange={ handleUpdateFormChange }
                                        value={ itemForm.hospital_id.value }
                                        color={ itemForm.hospital_id.color }
                                        helpMessage={ itemForm.hospital_id.message }
                                        helpClass={ itemForm.hospital_id.isErr ? 'visible' : 'invisible' }
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
                                :
                                    <ValidateInputForm 
                                        type="text"
                                        id="hospital"
                                        name="hospital"
                                        label="Hospital"
                                        innerRef={ hospitalRef }
                                        value={ itemForm.hospital.value }
                                        color={ itemForm.hospital.color }
                                        helpMessage={ itemForm.hospital.message }
                                        disabled="disabled"
                                    />
                                }
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
                                    <i class="bi bi-pencil-square"></i> &nbsp; Actualizar Usuario
                                </SubmitButtonForm>
                            </ColumnContainer>
                        </RowsContainer>
                    </Form>
            </MainContainer>
        </>
    );
};

export default EditarUsuario;