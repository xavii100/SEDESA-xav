import React, { useEffect, useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import { get_roles, get_sintomas, insert_sintoma } from '../../../api/catalogos';

import { Title } from "../../../components/layout/Title";
import { PlusUserIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2'

const FormularioRegistro = () => {
    const { auth } = useAuth();
    const [roles, setRoles] = useState([]);
    const [sintomas, setSintomas] = useState([]);
    const [message, setMessage] = useState([]);
    const [sintoma, setSintoma] = useState({
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
        
        // cargar todos los síntomas
        const getSintomas = async () => {
            const { data } = await get_sintomas(auth);
            setSintomas( () => data.sintomas );
        }

        getRoles();
        getSintomas();

    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setSintoma((prevTest) => ({
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

    const setInsertSintoma = async (e) => {
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
            // registrar nuevo síntoma
            const insertSintoma = async () => {
                const result = await insert_sintoma(auth, sintoma);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetSintoma").reset();
                    // document.getElementById("frmSetSintoma").style.display = "none";
                    Swal.fire({
                        title: "¡Síntoma registrado!",
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
            insertSintoma();
        };
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Registro de síntoma"
                />
                <RowsContainer columns={1}>
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                    <Form id="frmSetSintoma" onSubmit={setInsertSintoma}>
                        <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    placeholder="Escriba el nombre completo del síntoma" 
                                    required={true} 
                                    autofocus="True"
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="abreviatura" label="Abreviatura" />
                                <InputForm 
                                    type="text" 
                                    id="abreviatura" 
                                    name="abreviatura" 
                                    placeholder="Escriba la abreviatura del síntoma" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="principal" label="Principal"/>
                                <div class="flex">
                                    <RadioButtonForm
                                        label="No"
                                        id='principal_no'
                                        name='principal'
                                        value={false}
                                        required={true}
                                        onClick={handleUpdateFormChange}
                                    />
                                    <RadioButtonForm
                                        label="Sí"
                                        id='principal_si'
                                        name='principal'
                                        value={true}
                                        required={true}
                                        onClick={handleUpdateFormChange}
                                    />
                                </div>
                            </ColumnContainer>                        
                        </RowsContainer>

                        <RowsContainer columns={3}>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <SubmitButtonForm>
                                    <i class="text-md bi bi-plus-square-fill"></i>&nbsp;&nbsp;
                                    Registrar síntoma
                                </SubmitButtonForm>
                            </ColumnContainer>
                        </RowsContainer>
                    </Form>
            </MainContainer>
        </>
    );
};

export default FormularioRegistro;