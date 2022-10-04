import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_vacuna, edit_vacuna } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { vacunaid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [vacunas, setVacunas] = useState([]);
    const [message, setMessage] = useState([]);
    const [vacuna, setVacuna] = useState([]);

    useEffect(() => {
        // cargar datos de la vacuna seleccionada
        const getVacuna = async () => {
            const { data } = await get_vacuna({token: auth.token, vacuna_id: vacunaid});
            // setVacuna( () => data.data );
            setVacuna({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                vacuna_id: parseInt(data.data.cvacuna_id),
                nombre: data.data.nombre
            });
        }

        getVacuna();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setVacuna((prevTest) => ({
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
    
    const setVacunaActualizacion = (e) => {
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
                message: "Selecciona un vacuna de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {

            // editar vacuna con los nuevos valores
            const editVacuna = async () => {
                const result = await edit_vacuna(auth, vacuna);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetVacuna").reset();
                    // document.getElementById("frmSetVacuna").style.display = "none";
                    Swal.fire({
                        title: "¡Vacuna actualizada!",
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
            editVacuna();
        }     
    }

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de vacuna"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetVacuna" onSubmit={setVacunaActualizacion}>
                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="nombre" label="Nombre" />
                            <InputForm 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={vacuna.nombre}
                                placeholder="Escriba el nombre de la vacuna" 
                                required={true} 
                                autofocus="True"
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                    </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <SubmitButtonForm>
                                <EditIcon />
                                Actualizar vacuna
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;