import React, { useEffect, useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import { get_roles, get_antecedentes, insert_antecedente } from '../../../api/catalogos';

import { Title } from "../../../components/layout/Title";
import { PlusUserIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2'

const FormularioRegistro = () => {
    const { auth } = useAuth();
    const [roles, setRoles] = useState([]);
    const [antecedentes, setAntecedentes] = useState([]);
    const [message, setMessage] = useState([]);
    const [antecedente, setAntecedente] = useState({
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
        
        // cargar todos los antecedentes
        const getAntecedentes = async () => {
            const { data } = await get_antecedentes(auth);
            setAntecedentes( () => data.antecedentes );
        }

        getRoles();
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
            // registrar nuevo antecedente
            const insertSintoma = async () => {
                const result = await insert_antecedente(auth, antecedente);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetAntecedente").reset();
                    // document.getElementById("frmSetAntecedente").style.display = "none";
                    Swal.fire({
                        title: "¡Antecedente registrado!",
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

    //Ordeno alfabéticamente el array de objetos (antecedentes) para el select:
    antecedentes.sort((a, b) => {
        let primero = a.nombre.toLowerCase();
        let segundo = b.nombre.toLowerCase();
    
        if (primero < segundo) return -1;
        if (primero > segundo) return 1;
        return 0;
    });

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Registro de antecedente"
                />
                <RowsContainer columns={1}>
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                    <Form id="frmSetAntecedente" onSubmit={setInsertSintoma}>
                        <RowsContainer columns="3">
                            <ColumnContainer mb="0" mt="0" py="0" px="2">
                                <LabelForm htmlFor="nombre" label="Nombre" />
                                <InputForm 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
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
                                        onClick={handleUpdateFormChange}
                                    />
                                    <RadioButtonForm
                                        label="Sí"
                                        id='triage_si'
                                        name='triage'
                                        value={true}
                                        required={true}
                                        onClick={handleUpdateFormChange}
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
                                        antecedentes.map(antecedente => {
                                            return (
                                                <OptionSelectForm value={antecedente.cantecedente_id}>
                                                    {antecedente.nombre}
                                                </OptionSelectForm>
                                            )
                                        })
                                    }
                                </SelectForm>
                            </ColumnContainer>
                        </RowsContainer>

                        <RowsContainer columns={3}>
                            <ColumnContainer mb="0" mt="3" py="0" px="2">
                                <SubmitButtonForm>
                                    <i class="text-md bi bi-plus-square-fill"></i>&nbsp;&nbsp;
                                    Registrar antecedente
                                </SubmitButtonForm>
                            </ColumnContainer>
                        </RowsContainer>
                    </Form>
            </MainContainer>
        </>
    );
};

export default FormularioRegistro;