import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_sintomas, get_sintoma, edit_sintoma } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { sintomaid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [sintomas, setSintomas] = useState([]);
    const [message, setMessage] = useState([]);
    const [sintoma, setSintoma] = useState([]);
    const [esPrincipal, setEsPrincipal] = useState();

    useEffect(() => {
        // cargar datos del síntoma seleccionado
        const getSintoma = async () => {
            const { data } = await get_sintoma({token: auth.token, sintoma_id: sintomaid});
            console.log(data);
            // setSintoma( () => data.data );
            setSintoma({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                sintoma_id: sintomaid,
                nombre: data.data.nombre,
                abreviatura: data.data.abreviatura,
                principal: data.data.principal
            });

            //Asigno el valor inicial del radio button principal
            setEsPrincipal(data.data.principal);
        }

        getSintoma();
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
                message: "Selecciona un sintoma de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {

            // editar constante vital con los nuevos valores
            const editSintoma = async () => {
                const result = await edit_sintoma(auth, sintoma);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetSintoma").reset();
                    // document.getElementById("frmSetSintoma").style.display = "none";
                    Swal.fire({
                        title: "¡Síntoma actualizado!",
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
            editSintoma();
        }     
    }

    const handleEsPrincipalSi = () => {
        // console.log('Click en handleEsPrincipalSi');
        setEsPrincipal(true);
    };

    const handleEsPrincipalNo = () => {
        // console.log('Click en handleEsPrincipalNo');
        setEsPrincipal(false);
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de síntoma"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetSintoma" onSubmit={setConstanteVitalActualizacion}>
                <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={sintoma.nombre}
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
                                    value={sintoma.abreviatura}
                                    placeholder="Escriba la abreviatura de la síntoma" 
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
                                        onClick={ handleEsPrincipalNo }
                                        onChange={ handleUpdateFormChange }
                                        isChecked={ !esPrincipal }
                                    />
                                    <RadioButtonForm
                                        label="Sí"
                                        id='principal_si'
                                        name='principal'
                                        value={true}
                                        required={true}
                                        onClick={ handleEsPrincipalSi }
                                        onChange={ handleUpdateFormChange }
                                        isChecked={ esPrincipal }
                                    />
                                </div>
                            </ColumnContainer> 
                        </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <SubmitButtonForm>
                                <EditIcon />
                                Actualizar síntoma
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;