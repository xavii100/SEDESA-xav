import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_constantesvitales, get_constantevital, edit_constantevital } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { constanteVitalid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [constantesVitales, setConstantesVitales] = useState([]);
    const [message, setMessage] = useState([]);
    const [constanteVital, setConstanteVital] = useState([]);

    useEffect(() => {
        // cargar datos de la constante vital seleccionada
        const getConstanteVital = async () => {
            const { data } = await get_constantevital({token: auth.token, constante_vital_id: constanteVitalid});
            // setConstanteVital( () => data.data );
            setConstanteVital({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                constante_vital_id: parseInt(data.data.cconstante_vital_id),
                nombre: data.data.nombre,
                abreviatura: data.data.abreviatura,
                min: parseInt(data.data.min),
                max: parseInt(data.data.max),
                alerta_menor_que: parseInt(data.data.alerta_menor_que),
                alerta_mayor_que: parseInt(data.data.alerta_mayor_que)
            });
        }

        getConstanteVital();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setConstanteVital((prevTest) => ({
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
    
    const setConstanteVitalActualizacion = (e) => {
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
                message: "Selecciona un constanteVital de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {
            // Actualizar constante vital
            // console.log(constanteVital);
            const editConstanteVital = async () => {
                const result = await edit_constantevital(auth, constanteVital);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetConstanteVital").reset();
                    // document.getElementById("frmSetConstanteVital").style.display = "none";
                    Swal.fire({
                        title: "¡Constante vital actualizada!",
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
            editConstanteVital();
        }     
    }

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de constante vital"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetConstanteVital" onSubmit={setConstanteVitalActualizacion}>
                <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={constanteVital.nombre}
                                    placeholder="Escriba el nombre completo de la constante vital" 
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
                                    value={constanteVital.abreviatura}
                                    placeholder="Escriba la abreviatura de la constante vital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="min" label="Mínimo" />
                                <InputForm 
                                    type="number" 
                                    id="min" 
                                    name="min" 
                                    value={constanteVital.min}
                                    placeholder="Escriba el mínimo de la constante vital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                        </RowsContainer>
                        
                        <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="max" label="Máximo" />
                                <InputForm 
                                    type="number" 
                                    id="max" 
                                    name="max" 
                                    value={constanteVital.max}
                                    placeholder="Escriba el máximo de la constante vital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="alerta_menor_que" label="Alerta menor que" />
                                <InputForm 
                                    type="number" 
                                    id="alerta_menor_que" 
                                    name="alerta_menor_que" 
                                    value={constanteVital.alerta_menor_que}
                                    placeholder="Escriba la alerta menor que de la constante vital"
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="alerta_mayor_que" label="Alerta mayor que" />
                                <InputForm 
                                    type="number" 
                                    id="alerta_mayor_que" 
                                    name="alerta_mayor_que" 
                                    value={constanteVital.alerta_mayor_que}
                                    placeholder="Escriba la alerta mayor que de la constante vital" 
                                    required={true}
                                    onChange={handleUpdateFormChange}
                                />
                            </ColumnContainer>
                        </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <SubmitButtonForm>
                                <EditIcon />
                                Actualizar constante vital
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;