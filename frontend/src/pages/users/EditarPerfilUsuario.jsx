import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import { edit_user_profile, get_user } from '../../api/users';

import { Title } from "../../components/layout/Title";
import { MainContainer, RowsContainer, ColumnContainer } from '../../components/layout/Container';
import { Form, ValidateFloatIconForm, InputForm, SubmitButtonForm, LabelForm } from '../../components/layout/Form';
import { ValidInputPasswordForm, ValidInputTextForm } from '../../utils/FormValidation';

const EditarPerfilUsuario = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
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
    const passwordRef = useRef();
    const password2Ref = useRef();
    // --------------------------------------------------------------------------------
    
    // --------------------------------------------------------------------------------
    // password
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordShown2, setPasswordShown2] = useState(false);
    // --------------------------------------------------------------------------------

    useEffect(() => {
        // cargar datos del usuario logeado
        const getUserProfile = async () => {
            const { data } = await get_user({token: auth.token, id_user: auth.id_user});
            const fnac = data.data.fecha_nacimiento.split('-')
            setItemForm({
                usuario_id: {value: data.data.usuario_id},
                nombre: {value: data.data.nombre},
                apellido_paterno: {value: data.data.apellido_paterno},
                apellido_materno: {value: data.data.apellido_materno},
                email: {value: data.data.email},
                password: {value: '', message: '', color: '', isErr: false},
                password2: {value: '', message: '', color: '', isErr: false},
                fecha_nacimiento: {value: fnac[2]+"-"+fnac[1]+"-"+fnac[0]},
                rol: {value: data.data.rol},
                hospital: {value: data.data.hospital},
                curp: {value: data.data.curp},
                rfc: {value: data.data.rfc},
                sexo: {value: data.data.sexo === 'F' ? 'Femenino' : 'Masculino'},
                telefono: {value: data.data.telefono},
                cedula_profesional: {value: data.data.cedula_profesional},
                usuario_autoriza: {value: data.data.usuario_autoriza},
                cargo_usuario_autoriza: {value: data.data.cargo_usuario_autoriza},
            });
        }
        getUserProfile();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name, type } = e.target;
        ValidInputTextForm(name, value, type, itemForm, setItemForm);
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

        // if (itemForm.password.value !== '') {
        //     ValidInputPasswordForm('password', itemForm.password.value, 'password', itemForm, setItemForm);
        // }

        // for (const [key, valor] of Object.entries(itemForm)) {
        //     if (key !== 'password' || key !== 'password2') continue
        //     console.log(key, valor)
        //     // console.log(key == 'password' && valor.value === '' && itemForm.password2.value === '')
        //     if (key == 'password' && valor.value === '' && itemForm.password2.value === '') continue
        //     if (key == 'password2' && valor.value === '' && itemForm.password.value === '') continue
            
        //     switch (key) {

        //         case 'password':
        //             console.log("PASWD")
        //             ValidInputPasswordForm(key, valor.value, 'password', itemForm, setItemForm);
        //             passwordRef.current.focus();
        //             break;
                    
        //             case 'password2':
        //             console.log("PASWD2")
        //             ValidInputPasswordForm(key, valor.value, 'password', itemForm, setItemForm);
        //             password2Ref.current.focus();
        //             break;
                
        //     }
        //     return; // indicar para el primer campo vacío y evitar proseguir
        // }    

        // console.log("===================>")

        // se puede procesar la información para ser enviada al backend
        const info = {
            token: auth.token,
            password: itemForm.password.value,
        }

        // verificar si es que se desea actualizar el password
        if (itemForm.password.value === '' && itemForm.password2.value === '') { // se intenta actualizar el password
            delete info['password']; // no se actualiza el password, no es necesario enviarlo
            return // no hacer nada
        } else {
            if (e.target.password.value !== e.target.password2.value) { // los passwords no coinciden
                
                if (e.target.password.value === '') {
                    ValidInputPasswordForm('password', e.target.password.value, 'password', itemForm, setItemForm);
                    passwordRef.current.focus();
                    return;
                }
                
                if (e.target.password2.value === '') {
                    ValidInputPasswordForm('password2', e.target.password2.value, 'password', itemForm, setItemForm);
                    password2Ref.current.focus();
                    return;
                }

                if (e.target.password.value !== e.target.password2.value) {
                    return;
                }
            }
        }

        // metodo para registrar nuevo usuario
        const editUserProfileProcess = async () => {
            const result = await edit_user_profile(auth, info);
            if (result.status === 200) {
                document.getElementById("frmEditarUsuario").reset();
                Swal.fire({
                    title: 'Actualización',
                    position: 'center',
                    icon: 'success',
                    html: result.data.success,
                    showCancelButton: false,
                    confirmButtonText: 'Ok'
                }).then((res) => {
                    if (res.isConfirmed) { // hicieron click en "Sí"
                        navigate('/sedesa/inicio', { replace: true });
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

        editUserProfileProcess();

    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualizar contraseña"
                />
                <RowsContainer columns={1} addClass="mb-4">
                    <ColumnContainer>
                    </ColumnContainer>
                </RowsContainer>
                    <Form id="frmEditarUsuario" onSubmit={ handleInsertaUsuarioSubmit}>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <LabelForm htmlFor="nombre" label="Nombre(s)" />
                                <InputForm 
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={ itemForm.nombre.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                    />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="apellido_paterno" label="Apellido Paterno" />
                                <InputForm 
                                    type='text'
                                    id="apellido_paterno"
                                    name="apellido_paterno"
                                    value={ itemForm.apellido_paterno.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="apellido_materno" label="Apellido Materno" />
                                <InputForm 
                                    type="text"
                                    id="apellido_materno"
                                    name="apellido_materno"
                                    value={ itemForm.apellido_materno.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <LabelForm htmlFor="email" label="Correo Electrónico" />
                                <InputForm 
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={ itemForm.email.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="fecha_nacimiento" label="Fecha de Nacimiento" />
                                <InputForm 
                                    type="text"
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    value={ itemForm.fecha_nacimiento.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="sexo" label="Sexo" />
                                <InputForm 
                                    type="text"
                                    id="sexo"
                                    name="sexo"
                                    label="Sexo"
                                    value={ itemForm.sexo.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <LabelForm htmlFor="telefono" label="Número de Teléfono" />
                                <InputForm 
                                    type="text"
                                    id="telefono"
                                    name="telefono"
                                    value={ itemForm.telefono.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="curp" label="CURP" />
                                <InputForm 
                                    type="text"
                                    id="curp"
                                    name="curp"
                                    value={ itemForm.curp.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="rfc" label="RFC" />
                                <InputForm 
                                    type="text"
                                    id="rfc"
                                    name="rfc"
                                    value={ itemForm.rfc.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                        </RowsContainer>

                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <LabelForm htmlFor="cedula_profesional" label="Cédula Profesional" />
                                <InputForm 
                                    type="text"
                                    id="cedula_profesional"
                                    name="cedula_profesional"
                                    value={ itemForm.cedula_profesional.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="usuario_autoriza" label="Nombre de quien autoriza" />
                                <InputForm 
                                    type="text"
                                    id="usuario_autoriza"
                                    name="usuario_autoriza"
                                    value={ itemForm.usuario_autoriza.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="cargo_usuario_autoriza" label="Cargo de quien autoriza" />
                                <InputForm 
                                    type="text"
                                    id="cargo_usuario_autoriza"
                                    name="cargo_usuario_autoriza"
                                    value={ itemForm.cargo_usuario_autoriza.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        <RowsContainer columns={3} addClass="mb-4">
                            <ColumnContainer>
                                <LabelForm htmlFor="rol" label="Rol de Usuario" />
                                <InputForm 
                                    type="text"
                                    id="rol"
                                    name="rol"
                                    value={ itemForm.rol.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
                            </ColumnContainer>
                            <ColumnContainer>
                                <LabelForm htmlFor="hospital" label="Hospital" />
                                <InputForm 
                                    type="text"
                                    id="hospital"
                                    name="hospital"
                                    value={ itemForm.hospital.value }
                                    className="cursor-not-allowed"
                                    disabled="disabled"
                                />
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

export default EditarPerfilUsuario;
