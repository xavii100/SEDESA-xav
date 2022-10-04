import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_antecedentes, get_antecedente, edit_antecedente } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { antecedenteid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [antecedentes, setAntecedentes] = useState([]);
    const [message, setMessage] = useState([]);
    const [antecedente, setAntecedente] = useState([]);
    const [esTriage, setEsTriage] = useState();

    useEffect(() => {
        // cargar datos del antecedente seleccionado
        const getAntecedente = async () => {
            const { data } = await get_antecedente({token: auth.token, antecedente_id: antecedenteid});
            // setAntecedente( () => data.data );
            setAntecedente({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                antecedente_id: parseInt(data.data.cantecedente_id),
                cantecedente_primario: parseInt(data.data.cantecedente_primario),
                nombre: data.data.nombre,
                abreviatura: data.data.abreviatura,
                sinonimos: data.data.sinonimos,
                triage: data.data.triage
            });

            //Asigno el valor inicial del radio button triage
            setEsTriage(data.data.triage);
        }

        // cargar todos los antecedentes para el select
        const getAntecedentes = async () => {
            const { data } = await get_antecedentes(auth);
            setAntecedentes( () => data.antecedentes );
        }

        getAntecedente();
        getAntecedentes();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setAntecedente((prevTest) => ({
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
    
    const setAntecedenteActualizacion = (e) => {
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
                message: "Selecciona un antecedente de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {

            // editar constante vital con los nuevos valores
            const editAntecedente = async () => {
                const result = await edit_antecedente(auth, antecedente);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetAntecedente").reset();
                    // document.getElementById("frmSetAntecedente").style.display = "none";
                    Swal.fire({
                        title: "¡Antecedente actualizado!",
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
            editAntecedente();
        }     
    }

    //Ordeno alfabéticamente el array de objetos (antecedentes) para el select:
    antecedentes.sort((a, b) => {
        let primero = a.nombre.toLowerCase();
        let segundo = b.nombre.toLowerCase();
    
        if (primero < segundo) return -1;
        if (primero > segundo) return 1;
        return 0;
    });

    const handleEsTriageSi = () => {
        // console.log('Click en handleEsTriageSi');
        setEsTriage(true);
    };

    const handleEsTriageNo = () => {
        // console.log('Click en handleEsTriageNo');
        setEsTriage(false);
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de antecedente"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetAntecedente" onSubmit={setAntecedenteActualizacion}>
                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="nombre" label="Nombre" />
                            <InputForm 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={antecedente.nombre}
                                placeholder="Escriba el nombre completo del antecedente" 
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
                                value={antecedente.abreviatura}
                                placeholder="Escriba la abreviatura del antecedente" 
                                required={true}
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="sinonimos" label="Sinónimos" />
                            <InputForm 
                                type="text" 
                                id="sinonimos" 
                                name="sinonimos" 
                                value={antecedente.sinonimos}
                                placeholder="Escriba la sinónimos del antecedente" 
                                required={true}
                                onChange={handleUpdateFormChange}
                                textHelper='Separe cada sinónimo con una coma (,)'
                            />
                        </ColumnContainer>
                    </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="triage" label="Triage"/>
                            <div class="flex">
                                <RadioButtonForm
                                    label="No"
                                    id='triage_no'
                                    name='triage'
                                    value={false}
                                    required={true}
                                    onClick={ handleEsTriageNo }
                                    onChange={ handleUpdateFormChange }
                                    isChecked={ !esTriage }
                                />
                                <RadioButtonForm
                                    label="Sí"
                                    id='triage_si'
                                    name='triage'
                                    value={true}
                                    required={true}
                                    onClick={ handleEsTriageSi }
                                    onChange={ handleUpdateFormChange }
                                    isChecked={ esTriage }
                                />
                            </div>
                        </ColumnContainer>
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="cantecedente_primario" label="Antecedente primario" />
                                <SelectForm 
                                    type="text" 
                                    id="cantecedente_primario" 
                                    name="cantecedente_primario"
                                    onChange={handleUpdateFormChange}
                                >
                                    <OptionSelectForm value="0" selected="true" disabled="disabled">Seleccione un antecedente primario</OptionSelectForm>
                                    {
                                        antecedentes.map(antecedenteMap => {
                                            if (antecedente.cantecedente_primario == antecedenteMap.cantecedente_id) { //Es el seleccionado en la BD
                                                return (
                                                    <OptionSelectForm value={antecedenteMap.cantecedente_id} selected="true">
                                                        {antecedenteMap.nombre}
                                                    </OptionSelectForm>
                                                )
                                            }
                                            else { //No es el seleccionado en la BD
                                                return (
                                                    <OptionSelectForm value={antecedenteMap.cantecedente_id}>
                                                        {antecedenteMap.nombre}
                                                    </OptionSelectForm>
                                                )
                                            }
                                        })
                                    }
                                </SelectForm>
                            </ColumnContainer>
                    </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <SubmitButtonForm>
                                <EditIcon />
                                Actualizar antecedente
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;