import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_motivosAlta, get_motivoAlta, edit_motivoAlta } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { motivoAltaid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [motivosAlta, setMotivosAlta] = useState([]);
    const [message, setMessage] = useState([]);
    const [motivoAlta, setMotivoAlta] = useState([]);

    useEffect(() => {
        // cargar datos del motivo de alta seleccionado
        const getMotivoAlta = async () => {
            const { data } = await get_motivoAlta({token: auth.token, motivo_alta_id: motivoAltaid});
            // setMotivoAlta( () => data.data );
            setMotivoAlta({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                motivo_alta_id: motivoAltaid,
                nombre: data.data.nombre
            });
        }

        getMotivoAlta();
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
    
    const setMotivoAltaActualizacion = (e) => {
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
                message: "Selecciona un motivoAlta de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {

            // editar motivo de alta con los nuevos valores
            const editMotivoAlta = async () => {
                const result = await edit_motivoAlta(auth, motivoAlta);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetMotivoAlta").reset();
                    // document.getElementById("frmSetMotivoAlta").style.display = "none";
                    Swal.fire({
                        title: "¡Motivo de alta actualizado!",
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
            editMotivoAlta();
        }     
    }

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de motivo de alta"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetMotivoAlta" onSubmit={setMotivoAltaActualizacion}>
                <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={motivoAlta.nombre}
                                    placeholder="Escriba el nombre del motivo de alta"
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
                                Actualizar motivo de alta
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;