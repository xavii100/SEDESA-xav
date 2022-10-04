import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../../api/users';
import { get_terapeuticas, get_terapeutica, edit_terapeutica } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "./../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { terapeuticaid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [terapeuticas, setTerapeuticas] = useState([]);
    const [message, setMessage] = useState([]);
    const [terapeutica, setTerapeutica] = useState([]);
    const [atiendeCovid, setAtiendeCovid] = useState();

    useEffect(() => {
        // cargar datos de la terapéutica seleccionada
        const getTerapeutica = async () => {
            const { data } = await get_terapeutica({token: auth.token, terapeutica_id: terapeuticaid});
            // setTerapeutica( () => data.data );
            setTerapeutica({
                token: auth.token,
                id_usuario: data.data.usuario_id,
                crol: parseInt(data.data.rol_id),
                terapeutica_id: parseInt(terapeuticaid),
                nombre: data.data.nombre
            });
        }

        getTerapeutica();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setTerapeutica((prevTest) => ({
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
    
    const setUpdateTerapeutica = (e) => {
        e.preventDefault();
        if (/*e.target.crol.value === "0"*/ false) {
            setMessage({
                status: 700,
                message: "Selecciona un rol de usuario"
            })
            document.getElementById('crol').focus();
        } else if (/*e.target.tterapeutica.value === "0"*/ false) {
            setMessage({
                status: 700,
                message: "Selecciona un terapeutica de procedencia"
            })
            document.getElementById('tterapeutica').focus();
        } else {
            // Actualizar terapeutica
            // console.log(terapeutica);
            const editTerapeutica = async () => {
                const result = await edit_terapeutica(auth, terapeutica);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetTerapeutica").reset();
                    // document.getElementById("frmSetTerapeutica").style.display = "none";
                    Swal.fire({
                        title: "¡Terapéutica actualizada!",
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
            editTerapeutica();
        }
    }

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de terapéutica"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetTerapeutica" onSubmit={setUpdateTerapeutica}>
                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="nombre" label="Nombre" />
                            <InputForm 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={terapeutica.nombre}
                                placeholder="Escriba el nombre completo de la terapéutica" 
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
                                Actualizar terapéutica
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;