import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import {get_user, edit_user} from "../../api/users";
// import { get_user } from '../../api/users';
import {get_hospitales, get_roles} from "../../api/catalogos";

import {Title} from "../../components/layout/Title";
import {EditIcon} from "./../../components/layout/Icons";
import {MainContainer, RowsContainer, ColumnContainer} from "../../components/layout/Container";
import {Form, InputForm, LabelForm, SelectForm, OptionSelectForm, SubmitButtonForm} from "../../components/layout/Form";
import {SuccessAlert, DangerAlert} from "../../components/layout/Alerts";

const FormularioRegistro = () => {
  const {auth} = useAuth();
  const location = useLocation();
  const {userid} = location.state; // obtener el id enviado desde /sedesa/usuarios/ del componente UsersDataTable
  const [roles, setRoles] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    // cargar datos del usuario logeado
    const getUserProfile = async () => {
      const {data} = await get_user({token: auth.token, id_user: userid});
      // setUser( () => data.data );
      setUser({
        token: auth.token,
        id_usuario: data.data.usuario_id,
        thospital: parseInt(data.data.hospital_id),
        crol: parseInt(data.data.rol_id),
        email: data.data.email,
        password: "",
        nombre: data.data.nombre,
        apellido_paterno: data.data.apellido_paterno,
        apellido_materno: data.data.apellido_materno,
      });
    };

    // cargar todos los roles de usuario
    const getRoles = async () => {
      const {data} = await get_roles(auth);
      setRoles(() => data.roles);
    };

    // cargar todos los hospitales
    const getHospitals = async () => {
      const {data} = await get_hospitales(auth);
      setHospitals(() => data.hospitales);
    };

    getUserProfile();
    getRoles();
    getHospitals();
  }, []);

  // obtener los valores de los inputs del formulario cada vez que cambian
  const handleUpdateFormChange = e => {
    const {value, name} = e.target;
    setUser(prevTest => ({
      ...prevTest,
      [name]: value,
    }));
  };

  function getUserMessage(obj) {
    if (obj.status === 200) {
      // success
      return <SuccessAlert text={obj.data.success} />;
    } else if (obj.status === 700) {
      return <DangerAlert text={obj.message} />;
    } else if (obj.status === 400) {
      return <DangerAlert text={obj.data.error} />;
    } else {
      return "";
    }
  }

  const setUsuario = e => {
    e.preventDefault();

    if (e.target.crol.value === "0") {
      setMessage({
        status: 700,
        message: "Selecciona un rol de usuario",
      });
      document.getElementById("crol").focus();
    } else if (e.target.thospital.value === "0") {
      setMessage({
        status: 700,
        message: "Selecciona un hospital de procedencia",
      });
      document.getElementById("thospital").focus();
    } else if (e.target.password.value !== e.target.password2.value) {
      setMessage({
        status: 700,
        message: "Las contraseñas no coinciden. Verifica nuevamente",
      });
      document.getElementById("password").focus();
    } else {
      // editar usuario con los nuevos valores
      const editUser = async () => {
        const result = await edit_user(auth, user);
        if (result.status === 200) {
          setMessage(() => result);
          document.getElementById("frmSetUser").reset();
          document.getElementById("frmSetUser").style.display = "none";
        } else {
          setMessage(() => result);
        }
      };
      editUser();
    }
  };

  return (
    <>
      <MainContainer>
        <Title textAlign="text-left" title="Actualización de usuario" />
        <RowsContainer columns="1">
          <ColumnContainer mb="0" mt="0" py="0" px="2">
            {getUserMessage(message)}
          </ColumnContainer>
        </RowsContainer>
        <Form id="frmSetUser" onSubmit={setUsuario}>
          <RowsContainer columns="3">
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="nombre" label="Nombre(s)" />
              <InputForm
                type="text"
                id="nombre"
                name="nombre"
                value={user.nombre}
                placeholder="Escribe nombre o nombres"
                required={true}
                autofocus="True"
                onChange={handleUpdateFormChange}
              />
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="apellido_paterno" label="Apellido Paterno" />
              <InputForm
                type="text"
                id="apellido_paterno"
                name="apellido_paterno"
                value={user.apellido_paterno}
                placeholder="Apellido Paterno"
                required={true}
                onChange={handleUpdateFormChange}
              />
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="apellido_materno" label="Apellido Materno" />
              <InputForm
                type="text"
                id="apellido_materno"
                name="apellido_materno"
                value={user.apellido_materno}
                placeholder="Apellido Materno"
                required={true}
                onChange={handleUpdateFormChange}
              />
            </ColumnContainer>
          </RowsContainer>
          <RowsContainer columns="3">
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="email" label="Correo electrónico" />
              <InputForm type="email" id="email" name="email" value={user.email} placeholder="usuario@correo.com" required={true} onChange={handleUpdateFormChange} />
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="crol" label="Rol del Usuario" />
              <SelectForm id="crol" name="crol" required={true} onChange={handleUpdateFormChange}>
                <OptionSelectForm key="0" value="0">
                  Seleccione un rol de usuario
                </OptionSelectForm>
                {roles.map(rol => {
                  return (
                    <OptionSelectForm key={rol.crol_id} id={rol.crol_id} value={rol.crol_id} selected={rol.crol_id === user.crol}>
                      {rol.rol}
                    </OptionSelectForm>
                  );
                })}
              </SelectForm>
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="thospital" label="Hospital" />
              <SelectForm id="thospital" name="thospital" required={true} onChange={handleUpdateFormChange}>
                <OptionSelectForm key="0" value="0">
                  Selecciona un hospital
                </OptionSelectForm>
                {hospitals.map(hospital => {
                  return (
                    <OptionSelectForm key={hospital.thospital_id} id={hospital.thospital_id} value={hospital.thospital_id} selected={hospital.thospital_id === user.thospital}>
                      {hospital.nombre}
                    </OptionSelectForm>
                  );
                })}
              </SelectForm>
            </ColumnContainer>
          </RowsContainer>
          <RowsContainer columns="3">
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="password" label="Contraseña" />
              <InputForm type="password" id="password" name="password" placeholder="Escribe tu contraseña" onChange={handleUpdateFormChange} />
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="password2" label="Confirma contraseña" />
              <InputForm type="password" id="password2" name="password2" placeholder="Escribe nuevamente tu contraseña" onChange={handleUpdateFormChange} />
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2"></ColumnContainer>
          </RowsContainer>
          <RowsContainer columns="3">
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <SubmitButtonForm>
                <EditIcon />
                Actualizar Usuario
              </SubmitButtonForm>
            </ColumnContainer>
          </RowsContainer>
        </Form>
      </MainContainer>
    </>
  );
};

export default FormularioRegistro;
