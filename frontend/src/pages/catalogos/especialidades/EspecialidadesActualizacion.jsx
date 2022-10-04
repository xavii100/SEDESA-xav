import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_especialidades, get_especialidad, edit_especialidad } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { especialidadid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [message, setMessage] = useState([]);
    const [especialidad, setEspecialidad] = useState([]);
    const [agruparEnOtras, setAgruparEnOtras] = useState();

    useEffect(() => {
        // cargar datos del especialidad seleccionado
        const getEspecialidad = async () => {
            const { data } = await get_especialidad({token: auth.token, especialidad_tipo_id: especialidadid});
            // setEspecialidad( () => data.data );
            setEspecialidad({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                especialidad_id: especialidadid,
                nombre: data.data.nombre,
                agrupar_en_otras: data.data.agrupar_en_otras
            });

            //Asigno el valor inicial del radio button agrupar_en_otras
            setAgruparEnOtras(data.data.agrupar_en_otras);
        }

        getEspecialidad();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setEspecialidad((prevTest) => ({
            ...prevTest,
            [name]: value,
        }));
    };

    function getUserMessage(obj){
        if (obj.status === 200 ) { // success
            return <SuccessAlert text={obj.data.success} />
        } else if (obj.status === 700) {
            return <DangerAlert text={obj.message} />
        } else if (obj.status === 400) {
            return <DangerAlert text={obj.data.error} />
        } else {
            return ""
        }
    }
    
    const setEspecialidadActualizacion = (e) => {
        e.preventDefault();

        if (/*e.target.crol.value === "0"*/ false) {
            setMessage({
                status: 700,
                message: "Selecciona un rol de usuario"
            })
            document.getElementById('crol').focus()
        } else if (/*e.target.thospital.value === "0"*/ false) {
            setMessage({
                status: 700,
                message: "Selecciona un especialidad de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {

            // editar constante vital con los nuevos valores
            const editEspecialidad = async () => {
                const result = await edit_especialidad(auth, especialidad);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetEspecialidad").reset();
                    // document.getElementById("frmSetEspecialidad").style.display = "none";
                    Swal.fire({
                        title: "¡Especialidad actualizada!",
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
            editEspecialidad();
        }     
    }

    const handleAgruparEnOtrasSi = () => {
        // console.log('Click en handleAgruparEnOtrasSi');
        setAgruparEnOtras(true);
    };

    const handleAgruparEnOtrasNo = () => {
        // console.log('Click en handleAgruparEnOtrasNo');
        setAgruparEnOtras(false);
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de especialidad"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetEspecialidad" onSubmit={setEspecialidadActualizacion}>
                <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={especialidad.nombre}
                                    placeholder="Escriba el nombre completo de la especialidad"
                                    required={true} 
                                    autofocus="True"
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="agrupar_en_otras" label="Agrupar en otras"/>
                                <div class="flex">
                                    <RadioButtonForm
                                        label="No"
                                        id='agrupar_en_otras_no'
                                        name='agrupar_en_otras'
                                        value={false}
                                        required={true}
                                        onClick={ handleAgruparEnOtrasNo }
                                        onChange={ handleUpdateFormChange }
                                        isChecked={ !agruparEnOtras }
                                    />
                                    <RadioButtonForm
                                        label="Sí"
                                        id='agrupar_en_otras_si'
                                        name='agrupar_en_otras'
                                        value={true}
                                        required={true}
                                        onClick={ handleAgruparEnOtrasSi }
                                        onChange={ handleUpdateFormChange }
                                        isChecked={ agruparEnOtras }
                                    />
                                </div>
                            </ColumnContainer> 
                        </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <SubmitButtonForm>
                                <EditIcon />
                                Actualizar especialidad
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;