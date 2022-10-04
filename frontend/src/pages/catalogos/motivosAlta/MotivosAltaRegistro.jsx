import React, { useEffect, useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import { get_roles, get_motivosAlta, insert_motivoAlta } from '../../../api/catalogos';

import { Title } from "../../../components/layout/Title";
import { PlusUserIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2'

const FormularioRegistro = () => {
    const { auth } = useAuth();
    const [roles, setRoles] = useState([]);
    const [motivosAlta, setMotivosAlta] = useState([]);
    const [message, setMessage] = useState([]);
    const [motivoAlta, setMotivoAlta] = useState({
        token: auth.token
        /* thospital: 0,
        crol: 0,
        email: '',
        password: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '', */
    });

    useEffect(() => {
        // cargar todos los roles de usuario
        const getRoles = async () => {
            const { data } = await get_roles(auth);
            setRoles( () => data.roles );
        }
        
        // cargar todos los motivos de alta
        const getMotivosAlta = async () => {
            const { data } = await get_motivosAlta(auth);
            setMotivosAlta( () => data.motivo_alta );
        }

        getRoles();
        getMotivosAlta();

    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setMotivoAlta((prevTest) => ({
            ...prevTest,
            [name]: value,
        }));
    };

    function getUserMessage(obj){
        if (obj.status === 200) {
            return <SuccessAlert text={obj.data.success} />
        } else if (obj.status === 400) {
            return <DangerAlert text={obj.data.error} />
        } else if (obj.status === 700) {
            return <DangerAlert text={obj.message} />
        } else {
            return ""
        }
    }

    const setInsertMotivoAlta = async (e) => {
        e.preventDefault();
        if (/*e.target.crol.value === "0"*/ false) {
            setMessage({
                status: 700,
                message: "Selecciona un rol de usuario"
            })
            document.getElementById('crol').focus();
        } else if (/*e.target.thospital.value === "0"*/ false) {
            setMessage({
                status: 700,
                message: "Selecciona un hospital de procedencia"
            })
            document.getElementById('thospital').focus();
        } else {
            // registrar nuevo motivo de alta
            const insertMotivoAlta = async () => {
                const result = await insert_motivoAlta(auth, motivoAlta);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetMotivoAlta").reset();
                    // document.getElementById("frmSetMotivoAlta").style.display = "none";
                    Swal.fire({
                        title: "¡Motivo de alta registrado!",
                        icon: 'success',
                        html: result.data.success,
                        showCancelButton: false,
                        confirmButtonText: 'Ok'
                    }).then( (result) => {
                        if (result.isConfirmed) { // hicieron click en "Sí"
                            window.location.href = './';
                        }
                    });
                } else {
                    setMessage( () => result );
                }
            }
            insertMotivoAlta();
        };
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Registro de motivo de alta"
                />
                <RowsContainer columns={1}>
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                    <Form id="frmSetMotivoAlta" onSubmit={setInsertMotivoAlta}>
                        <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    placeholder="Escriba el nombre del motivo de alta" 
                                    required={true} 
                                    autofocus="True"
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                        </RowsContainer>

                        <RowsContainer columns={3}>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <SubmitButtonForm>
                                    <i class="text-md bi bi-plus-square-fill"></i>&nbsp;&nbsp;
                                    Registrar motivo de alta
                                </SubmitButtonForm>
                            </ColumnContainer>
                        </RowsContainer>
                    </Form>
            </MainContainer>
        </>
    );
};

export default FormularioRegistro;