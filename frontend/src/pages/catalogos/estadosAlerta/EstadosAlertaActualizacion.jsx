import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../api/users';
import { get_estadosAlerta, get_estadoAlerta, edit_estadoAlerta } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { estadoAlertaid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [estadosAlerta, setEstadosAlerta] = useState([]);
    const [message, setMessage] = useState([]);
    const [estadoAlerta, setEstadoAlerta] = useState([]);
    const [inputsOpciones, setInputsOpciones] = useState([]);

    useEffect(() => {
        // cargar datos del estado de alerta seleccionado
        const getEstadoAlerta = async () => {
            const { data } = await get_estadoAlerta({token: auth.token, estado_alerta_id: estadoAlertaid});
            // setEstadoAlerta( () => data.data );
            setEstadoAlerta({
                token: auth.token,
                usuario_id: parseInt(data.data.usuario_id),
                estado_alerta_id: estadoAlertaid,
                nombre: data.data.nombre,
                abreviatura: data.data.abreviatura,
                opciones: data.data.opciones
            });

            if (data.data.opciones.length > 0) { //Sí vienen opciones del back
                let contador = 0;
                let array = [];
                for (const opcion of data.data.opciones) {
                    //Agrego la opción al array de objetos:
                    contador ++;
                    let nuevoInput = `opcion_${contador}`;
                    let newObjeto = JSON.parse(`{"${nuevoInput}": "${opcion.nombre}"}`);
                    array.push(newObjeto);
                }
                setInputsOpciones(array);
            }
            else setInputsOpciones([{ opcion_1: '' }]); //No vienen opciones del back
        }
        getEstadoAlerta();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e, key = false) => {
        const { value, name } = e.target;
        setEstadoAlerta((prevTest) => ({
            ...prevTest,
            [name]: value,
        }));

        if (key !== false) actualizarOpciones(key, value, name);
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
    
    const setEstadoAlertaActualizacion = (e) => {
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
                message: "Selecciona un estadoAlerta de procedencia"
            })
            document.getElementById('thospital').focus()
        } else {

            // editar estado de alerta con los nuevos valores
            const editEstadoAlerta = async () => {
                const result = await edit_estadoAlerta(auth, estadoAlerta);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetEstadoAlerta").reset();
                    // document.getElementById("frmSetEstadoAlerta").style.display = "none";
                    Swal.fire({
                        title: "¡Estado de alerta actualizado!",
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
            editEstadoAlerta();
        }     
    }

    const handleAddOpcion = (e) => {
        let totalInputs = inputsOpciones.length + 1;

        //Agrego 1 elemento al array de inputs
        let nuevoInput = `opcion_${totalInputs}`;

        let newObjeto = JSON.parse(`{"${nuevoInput}": ""}`);
        setInputsOpciones([...inputsOpciones, newObjeto]);
    };

    const handleRemoveOpcion = (key) => {
        let newInputsOpciones = inputsOpciones.filter((_, index) => index !== key);
        setInputsOpciones(newInputsOpciones);
    };

    const actualizarOpciones = (key, valorInput, nameInput) => {
        let newInputsOpciones = [...inputsOpciones];
        let newObjeto = JSON.parse(`{"${nameInput}": "${valorInput}"}`);

        newInputsOpciones[key] = newObjeto;
        setInputsOpciones(newInputsOpciones);

        let opciones = [];
        inputsOpciones.map((value, index) => opciones.push(Object.values(value)[0]));

        setEstadoAlerta((prevTest) => ({
            ...prevTest,
            ['opciones']: opciones,
        }));
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de estado de alerta"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetEstadoAlerta" onSubmit={setEstadoAlertaActualizacion}>
                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="nombre" label="Nombre" />
                            <InputForm 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={estadoAlerta.nombre}
                                placeholder="Escriba el nombre completo del estado de alerta"
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
                                value={estadoAlerta.abreviatura}
                                placeholder="Escriba la abreviatura del estado de alerta" 
                                required={true}
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                    </RowsContainer>

                    <RowsContainer columns={3}>
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="opciones" label="Opciones" />
                            <div className="flex flex-wrap flex-row-reverse mb-3">
                                <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 px-2 pt-0 pb-1 ml-3 rounded-lg" title='Agregar opción' onClick={ () => handleAddOpcion() }>
                                    {/* <i class="text-base bi bi-plus"></i> */}
                                    <small>Agregar opción</small>
                                </button>
                            </div>
                            { inputsOpciones.map((value, key) => {
                                let contador = key + 1;
                                let inputKey = Object.keys(value)[0];
                                let placeholderTxt = `Escriba la opción ${contador} del estado de alerta`;
                                return(
                                    <>
                                        {contador > 1 ?
                                            <div className='text-right mb-2'>
                                                <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 px-2 pt-0 pb-1 rounded-lg" title='Remover opción' onClick={() => handleRemoveOpcion(key)}>
                                                    {/* <i class="text-base bi bi-dash"></i> */}
                                                    <small>Eliminar opción</small>
                                                </button>
                                            </div>
                                            : ''
                                        }
                                        <div>
                                            <InputForm 
                                                type="text" 
                                                id={inputKey} 
                                                name={inputKey} 
                                                placeholder={placeholderTxt} 
                                                required={true}
                                                value={value[inputKey]}
                                                onChange={ (e) => handleUpdateFormChange(e, key) }
                                            />
                                        </div>
                                    </>
                                );
                            })}
                        </ColumnContainer>
                    </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <SubmitButtonForm>
                                <EditIcon />
                                Actualizar estado de alerta
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;