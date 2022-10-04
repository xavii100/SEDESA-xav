import React, { useEffect, useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import { get_roles, get_hospitales, insert_hospital } from '../../../api/catalogos';

import { Title } from "../../../components/layout/Title";
import { PlusUserIcon } from "./../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioRegistro = () => {
    const { auth } = useAuth();
    const [roles, setRoles] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [message, setMessage] = useState([]);
    const [hospital, setHospital] = useState({
        token: auth.token
        /* nombre : "",
        nombre_corto : "",
        direccion : "",
        atiende_covid19 : "",
        clues : "",
        cp : "" */
        // hospital_id : "" #opcional para editar hospital
    });

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
        const { value, name } = e.target;
        setHospital((prevTest) => ({
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

    const setInsertHospital = async (e) => {
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
            // registrar nuevo hospital
            // console.log(hospital);
            const insertUser = async () => {
                const result = await insert_hospital(auth, hospital);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetHospital").reset();
                    // document.getElementById("frmSetHospital").style.display = "none";
                    Swal.fire({
                        title: "¡Hospital registrado!",
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
            insertUser();
        };
    };


    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Registro de hospital"
                />
                <RowsContainer columns={1}>
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                    <Form id="frmSetHospital" onSubmit={setInsertHospital}>
                        <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    placeholder="Escriba el nombre completo del hospital" 
                                    required={true} 
                                    autofocus="True"
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre_corto" label="Nombre corto" />
                                <InputForm 
                                    type="text" 
                                    id="nombre_corto" 
                                    name="nombre_corto" 
                                    placeholder="Escriba el nombre corto del hospital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="direccion" label="Dirección" />
                                <InputForm 
                                    type="textarea" 
                                    id="direccion" 
                                    name="direccion" 
                                    placeholder="Escriba la dirección del hospital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        
                        <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="atiende_covid19" label="Atiende COVID-19"/>
                                <div class="flex">
                                    <RadioButtonForm
                                        label="No"
                                        id='atiende_covid19_no'
                                        name='atiende_covid19'
                                        value={false}
                                        required={true}
                                        onClick={handleUpdateFormChange}
                                    />
                                    <RadioButtonForm
                                        label="Sí"
                                        id='atiende_covid19_si'
                                        name='atiende_covid19'
                                        value={true}
                                        required={true}
                                        onClick={handleUpdateFormChange}
                                    />
                                </div>
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="clues" label="Clues" />
                                <InputForm 
                                    type="text" 
                                    id="clues" 
                                    name="clues" 
                                    placeholder="Escriba el clue del hospital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="cp" label="CP" />
                                <InputForm 
                                    type="number" 
                                    id="cp" 
                                    name="cp" 
                                    placeholder="Escriba el CP del hospital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                        </RowsContainer>

                        <RowsContainer columns={3}>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <SubmitButtonForm>
                                    <i class="text-md bi bi-plus-square-fill"></i>&nbsp;&nbsp;
                                    Registrar hospital
                                </SubmitButtonForm>
                            </ColumnContainer>
                        </RowsContainer>
                    </Form>
            </MainContainer>
        </>
    );
};

export default FormularioRegistro;