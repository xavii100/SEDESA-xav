import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_medicamento, edit_medicamento } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { medicamentoid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [message, setMessage] = useState([]);
    const [medicamento, setMedicamento] = useState([]);

    useEffect(() => {
        // cargar datos del medicamento seleccionado
        const getMedicamento = async () => {
            const { data } = await get_medicamento({token: auth.token, medicamento_id: medicamentoid});
            // setMedicamento( () => data.data );
            setMedicamento({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                medicamento_id: parseInt(data.data.cmedicamento_id),
                nombre: data.data.nombre
            });
        }

        getMedicamento();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setMedicamento((prevTest) => ({
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
    
    const setMedicamentoActualizacion = (e) => {
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
                message: "Selecciona un medicamento de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {

            // editar medicamento con los nuevos valores
            const editMedicamento = async () => {
                const result = await edit_medicamento(auth, medicamento);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetMedicamento").reset();
                    // document.getElementById("frmSetMedicamento").style.display = "none";
                    Swal.fire({
                        title: "¡Medicamento actualizado!",
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
            editMedicamento();
        }     
    }

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de medicamento"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetMedicamento" onSubmit={setMedicamentoActualizacion}>
                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="nombre" label="Nombre" />
                            <InputForm 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={medicamento.nombre}
                                placeholder="Escriba el nombre del medicamento"
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
                                Actualizar medicamento
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;