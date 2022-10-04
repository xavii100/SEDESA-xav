import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth';
import { get_user, edit_user } from '../../../api/users';
// import { get_user } from '../../../api/users';
import { get_hospitales, get_hospital, edit_hospital } from '../../../api/catalogos';


import { Title } from "../../../components/layout/Title";
import { EditIcon } from "./../../../components/layout/Icons";
import { MainContainer, RowsContainer, ColumnContainer } from '../../../components/layout/Container';
import { Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm, RadioButtonForm } from '../../../components/layout/Form';
import { SuccessAlert, DangerAlert } from '../../../components/layout/Alerts';
import Swal from 'sweetalert2';

const FormularioActualizacion = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const { hospitalid } = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
    const [roles, setRoles] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [message, setMessage] = useState([]);
    const [hospital, setHospital] = useState([]);
    const [atiendeCovid, setAtiendeCovid] = useState();

    useEffect(() => {
        // cargar datos del hospital seleccionado
        const getHospital = async () => {
            const { data } = await get_hospital({token: auth.token, hospital_id: hospitalid});
            // setHospital( () => data.data );
            setHospital({
                token: auth.token,
                id_usuario: data.data.usuario_id,
                crol: parseInt(data.data.rol_id),
                hospital_id: parseInt(hospitalid),
                nombre: data.data.nombre,
                nombre_corto: data.data.nombre_corto,
                direccion: data.data.direccion,
                atiende_covid19: data.data.atiende_covid19,
                clues: data.data.clues,
                cp: data.data.cp
            });

            //Asigno el valor inicial del radio button atiende_covid19
            setAtiendeCovid(data.data.atiende_covid19);
        }

        getHospital();
    }, []);

    // obtener los valores de los inputs del formulario cada vez que cambian
    const handleUpdateFormChange = (e) => {
        const { value, name } = e.target;
        setHospital((prevTest) => ({
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
    
    const setUpdateHospital = (e) => {
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
            // Actualizar hospital
            // console.log(hospital);
            const editUser = async () => {
                const result = await edit_hospital(auth, hospital);
                if (result.status >= 200 && result.status <= 299) {
                    setMessage( () => result );
                    document.getElementById("frmSetHospital").reset();
                    // document.getElementById("frmSetHospital").style.display = "none";
                    Swal.fire({
                        title: "¡Hospital actualizado!",
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
            editUser();
        }
    }

    const handleAtiendeCovidSi = () => {
        // console.log('Click en handleAtiendeCovidSi');
        setAtiendeCovid(true);
    };

    const handleAtiendeCovidNo = () => {
        // console.log('Click en handleAtiendeCovidNo');
        setAtiendeCovid(false);
    };

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="text-left"
                    title="Actualización de hospital"
                    />
                <RowsContainer columns="1">
                    <ColumnContainer mb="0" mt="0" py="0" px="2">
                        { getUserMessage(message) }
                    </ColumnContainer>
                </RowsContainer>
                <Form id="frmSetHospital" onSubmit={setUpdateHospital}>
                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="nombre" label="Nombre" />
                            <InputForm 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={hospital.nombre}
                                placeholder="Escriba el nombre completo del hospital" 
                                required={true} 
                                autofocus="True"
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="nombre_corto" label="Nombre corto" />
                            <InputForm 
                                type="text" 
                                id="nombre_corto" 
                                name="nombre_corto" 
                                value={hospital.nombre_corto}
                                placeholder="Escriba el nombre corto del hospital" 
                                required={true}
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="direccion" label="Dirección" />
                            <InputForm 
                                type="textarea" 
                                id="direccion" 
                                name="direccion" 
                                value={hospital.direccion}
                                placeholder="Escriba la dirección del hospital" 
                                required={true}
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                    </RowsContainer>

                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="atiende_covid19" label="Atiende COVID-19" />
                            <div class="flex">
                                <RadioButtonForm
                                    label="No"
                                    id='atiende_covid19_no'
                                    name='atiende_covid19'
                                    value={false}
                                    required={true}
                                    onClick={ handleAtiendeCovidNo }
                                    onChange={ handleUpdateFormChange }
                                    isChecked={ !atiendeCovid }
                                />
                                <RadioButtonForm
                                    label="Sí"
                                    id='atiende_covid19_si'
                                    name='atiende_covid19'
                                    value={true}
                                    required={true}
                                    onClick={ handleAtiendeCovidSi }
                                    onChange={ handleUpdateFormChange }
                                    isChecked={ atiendeCovid }
                                />
                            </div>
                        </ColumnContainer>
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="clues" label="Clues" />
                            <InputForm 
                                type="text" 
                                id="clues" 
                                name="clues" 
                                value={hospital.clues}
                                placeholder="Escriba el clue del hospital" 
                                required={true}
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <LabelForm htmlFor="cp" label="CP" />
                            <InputForm 
                                type="number" 
                                id="cp" 
                                name="cp" 
                                value={hospital.cp}
                                placeholder="Escriba el CP del hospital" 
                                required={true}
                                onChange={handleUpdateFormChange}
                            />
                        </ColumnContainer>
                    </RowsContainer>
                    <RowsContainer columns="3">
                        <ColumnContainer mb="0" mt="0" py="0" px="2">
                            <SubmitButtonForm>
                                <EditIcon />
                                Actualizar hospital
                            </SubmitButtonForm>
                        </ColumnContainer>
                    </RowsContainer>
                </Form>
            </MainContainer>
        </>
    );
};

export default FormularioActualizacion;