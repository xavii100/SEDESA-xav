import React, { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { get_all_triage, set_paciente } from "../../api/triage";
import * as semaforos from "../../api/semaforos";
import "../../css/index.css";
import { CenteredContainer, RowsContainer, ColumnContainer } from "../../components/layout/Container";
import { Title } from "../../components/layout/Title";
import { LabelForm, InputForm, SelectForm, OptionSelectForm, SubmitButtonForm, ToggleSwitchForm, InputSearchSelection } from "../../components/layout/Form";
import { Table } from "./../../components/layout/Table";
import { SaveIcon } from "./../../components/layout/Icons";
import { SuccessAlert, DangerAlert } from "../../components/layout/Alerts";
import Swal from 'sweetalert2'
import Multiselect from "multiselect-react-dropdown";


//const baseURL = "http://127.0.0.1:8000";

const FormularioTriage = () => {
  const navigate = useNavigate();
  const INITARRAY = {
    nombre: "",
    nacimiento: "",
    filiacion: "",
    genero: "",
    embarazo: "",
    antecedentes: "",
    inicio_sintomas: "",
  };

  const statusClases = {
    Normal: "normal",
    Hospitalizacion: "alarma",
    Grave: "grave",
    Coma: "coma",
  };
  const statusMensajes = {
    Normal: "Normal",
    Hospitalizacion: "Alarma de hospitalización",
    Grave: "Grave",
    Coma: "Coma profundo",
  };

  const INITANTECEDENTES = {};
  const INITVACUNAS = {};
  const INITPRINCIPAL = {};
  const INITSECUNDARIOS = {};
  const INITVITALES = {};
  const INITESTADOSA = {};
  //Autenticacion
  const { auth } = useAuth();
  //Estados de valores
  const [valuesG, setValuesG] = useState(INITARRAY);
  const [vAntecedentes, setvAntecedentes] = useState({});
  const [vVacunas, setvVacunas] = useState({});
  const [vPrincipales, setvPrincipales] = useState({});
  const [vSecundarios, setvSecundarios] = useState({});
  const [vVitales, setvVitales] = useState({});
  const [vAlerta, setvAlerta] = useState({});
  const [datos, setDatos] = useState({});
  //Estados de validaciones
  const [validacionesG, setValidacionesG] = useState(INITARRAY);
  // const [vPrincipales, setvPrincipales] = useState({});
  // const [vSecundarios, setvSecundarios] = useState({});
  const [vaVitales, setvaVitales] = useState({});
  const [vaAlerta, setvaAlerta] = useState({});

  // Estados de GET
  const [antecedentes, setAntecedentes] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [sPrincipales, setsPrincipales] = useState([]);
  const [sSecundarios, setsSecundarios] = useState([]);
  const [cVitales, setcVitales] = useState([]);
  const [eAlerta, seteAlerta] = useState([]);

  const [news2, setNews2] = useState("Normal");
  const [qsofa, setQsofa] = useState("Normal");
  const [glassgow, setGlassgow] = useState("Normal");

  const [embarazo, setEmbarazo] = useState(false);
  const [genero, setGenero] = useState(true);
  const [dosis, setDosis] = useState([]);

  const [message, setMessage] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await get_all_triage(auth);
      setsPrincipales(() => data.sintomas_principales);
      setsSecundarios(() => data.sintomas_secundarios);
      setcVitales(() => data.constantes_vitales);
      setAntecedentes(() => data.antecedentes);
      setVacunas(() => data.vacunas);
      seteAlerta(() => data.estado_alerta);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cargaValues = () => {
      antecedentes.forEach((antecedentes) => {
        INITANTECEDENTES["a_" + antecedentes.cantecedente_id] = false;
      });
      setvAntecedentes(() => INITANTECEDENTES);
      
      vacunas.forEach((vacuna) => {
        INITANTECEDENTES["c_" + vacuna.cvacuna_id] = false;
      });
      setvVacunas(() => INITVACUNAS);
      
      sPrincipales.forEach((principal) => {
        INITPRINCIPAL["p_" + principal.csintoma_id] = false;
      });
      setvPrincipales(() => INITPRINCIPAL);

      sSecundarios.forEach((secundario) => {
        INITSECUNDARIOS["s_" + secundario.csintoma_id] = false;
      });
      setvSecundarios(() => INITSECUNDARIOS);

      cVitales.forEach((vital) => {
        INITVITALES["v_" + vital.cconstante_vital_id] = "";
      });
      setvVitales(() => INITVITALES);
      setvaVitales(() => INITVITALES);

      eAlerta.forEach((alerta) => {
        INITESTADOSA["e_" + alerta.cestado_alerta_id] = "";
      });
      setvAlerta(() => INITESTADOSA);
      setvaAlerta(() => INITESTADOSA);
    };
    cargaValues();
    setGenero(genero)
    setEmbarazo(embarazo)
    setDosis(dosis)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cVitales], [eAlerta], [genero], [embarazo], [dosis]);


  const handleChangeG = (e) => {
    const { name, value } = e.target;
    if (name === "generom" && value === "M") {
      setGenero(true);
      setValuesG({ ...valuesG, genero: value });
    } else if (name === "generoh" && value === "H") {
      setEmbarazo(false);
      setGenero(false);
      setValuesG({ ...valuesG, genero: value });
    }
    if (name === "embarazos" && value === "true") {
      setEmbarazo(true);
      setValuesG({ ...valuesG, embarazo: "embarazo" });
    } else if (name === "embarazon" && value === "false") {
      setEmbarazo(false);
    }
    if (name === "numero_dosis") {
      if (dosis.length <= value && value > 0) {
        for (let i = 0; i <= value; i++) {
          dosis[value - 1] = value;
        }
      } else {
        dosis.splice(value, 1);
      }
      setDosis(dosis);
    }
    setValuesG({ ...valuesG, [name]: value });
  };


  const handleChangeAntecedentes = (e) => {
    const { name, checked } = e.target;
    setvAntecedentes({ ...vAntecedentes, [name]: checked });
  };

  const handleChangeVacunas = (e) => {
    const { name, checked } = e.target;
    setvVacunas({ ...vVacunas, [name]: checked });
  };

  const handleChangePrincipales = (e) => {
    const { name, checked } = e.target;
    setvPrincipales({ ...vPrincipales, [name]: checked });
  };

  const handleChangeSecundarios = (e) => {
    const { id, checked } = e.target;
    setvSecundarios({ ...vSecundarios, [id]: checked });
  };

  const handleChangeVitales = (e) => {
    const { name, value } = e.target;
    setvVitales({ ...vVitales, [name]: value });
    handleRecalcular(e);
  };

  const handleChangeAlerta = (e) => {
    const { name, value } = e.target;
    setvAlerta({ ...vAlerta, [name]: value });
    handleRecalcular(e);
  };

  const tableHeadSintomas = [{ text: "Sintoma" }, { text: "Selección" }];

  function getUserMessage(obj) {
    if (obj.status === 200) {
      //return <SuccessAlert text={obj.data.success} />;
      Swal.fire({
        position: 'center',
        icon: 'success',
        html: "<p>" + datos.nombre + "</p>",
        title: obj.data.success,
        showConfirmButton: true,
      })
    } else if (obj.status === 400) {
      return <DangerAlert text={obj.data.error} />;
    } else if (obj.status === 700) {
      return <DangerAlert text={obj.message} />;
    } else {
      return "";
    }
  }

  //function handleRecalcular(e){
  const handleRecalcular = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setQsofa(
      semaforos.hospitalizacionqSOFA(vVitales.v_3, vAlerta.e_2, vAlerta.e_3, vVitales.v_6, vAlerta.e_4)
    );
    setNews2(semaforos.hospitalizacionNEWS2(vVitales.v_3, vVitales.v_5, vVitales.v_4, vVitales.v_6, vVitales.v_2, vVitales.v_3, vAlerta.e_1));
    setGlassgow(
      semaforos.hospitalizacionGlassgow(vAlerta.e_2, vAlerta.e_3, vAlerta.e_4)
    )
  };

  function onSelect(selectedList, selectedItem) {
    setvAntecedentes(selectedList);
  };

  function onRemove(selectedList, removedItem) {
    setvAntecedentes(selectedList);
  };

  const procesaDatos = async () => {
    var datoscompletos = {
      token: "",
      nombre: "",
      fecha_nacimiento: "",
      filiacion: "",
      genero: "",
      embarazo: "",
      antecedentes: "",
      fecha_inicio_sintomas: "",
      semanas_gestacion: "",
      sospecha_covid: "",
      puntaje_news2: "",
      puntaje_qsofa: "",
      puntaje_glassgow: "",
      sintomas: [],
      estados_alerta: [],
      antecedentes: [],
      constantes_vitales: [],
    };

    var sinpri = Object.entries(vPrincipales).filter(([key, value]) => value == true);
    var sintomasp = [].concat.apply([], sinpri);
    var sinsec = Object.entries(vSecundarios).filter(([key, value]) => value == true);
    var sintomass = [].concat.apply([], sinsec);
    var sintomasf = [...sintomasp, ...sintomass]

    var llaves = sintomasf.filter(el => el !== true).map(elem => elem);
    llaves = llaves.map(Number);
    var vitalesval = Object.entries(vVitales).filter(([key, value]) => value !== "");
    var vitalvar = [];
    for (let i = 0; i < vitalesval.length; i++) {
      const vit = {
        id: parseInt(vitalesval[i][0].substring(2)),
        cantidad: vitalesval[i][1],
      }
      vitalvar = [...vitalvar, vit]
    } 
    const anteval = [];
    if (vAntecedentes?.length > 0) {
      console.log('array is not empty');
      vAntecedentes.map((antecedente, index) => {
        anteval[index] = antecedente.cantecedente_id;
      });
    }


    var alertaval = Object.entries(vAlerta).filter(([key, value]) => value !== "");
    var alertavar = [];
    for (let i = 0; i < alertaval.length; i++) {
      alertavar = [...alertavar, parseInt(alertaval[i][1])]
    }
    datoscompletos.token = auth.token;
    datoscompletos.nombre = valuesG.nombre;
    datoscompletos.filiacion = valuesG.filiacion;
    datoscompletos.fecha_nacimiento = valuesG.nacimiento;
    datoscompletos.genero = (genero) ? "M" : "H";
    datoscompletos.fecha_inicio_sintomas = valuesG.inicio_sintomas;
    datoscompletos.embarazo = embarazo;
    datoscompletos.semanas_gestacion = valuesG.semanas_gestacion;
    datoscompletos.sospecha_covid = false;
    datoscompletos.puntaje_news2 = 1;
    datoscompletos.puntaje_qsofa = 2;
    datoscompletos.puntaje_glassgow = 3;
    datoscompletos.sintomas = llaves;
    datoscompletos.estados_alerta = alertavar;
    datoscompletos.antecedentes = anteval;
    datoscompletos.constantes_vitales = vitalvar;
    setDatos(datoscompletos)
    //console.log("DATOS"+JSON.stringify(datoscompletos));
    return datoscompletos;
  }

  const setFormulario = async (e) => {
    e.preventDefault();
    const resultado = await procesaDatos();
    console.log("DATOS" + JSON.stringify(resultado));
    const insertPaciente = async () => {
      const result = await set_paciente(auth, resultado);
      if (result.status === 200) {
        setMessage(() => result);
        document.getElementById("frmTriageUser").reset();
        document.getElementById("frmTriageUser").style.display = "none";
        navigate('/sedesa/pacientes');
      } else {
        setMessage(() => result);
      }
    };
    insertPaciente();
  };

  return (
    <>
      <CenteredContainer>
        <Title textAlign="text-left" title="Triage Respiratorio" />
        <RowsContainer columns={1}>
          <ColumnContainer mb="0" mt="0" py="0" px="2">
            {getUserMessage(message)}
          </ColumnContainer>
        </RowsContainer>
        <form id="frmTriageUser" onSubmit={setFormulario}>
          <RowsContainer columns="1" columnsGap="4">
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="nombre" label="Nombre" />
              <InputForm type="text" id="nombre" name="nombre" placeholder="Escriba nombre y apellidos" value={valuesG.nombre} onChange={handleChangeG} required={true} />
              <LabelForm htmlFor="nombre" label="El nombre del paciente no puede estar a la vista de nadie y se está encriptando para su almacenamiento." />
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="nacimiento" label="Nacimiento" />
              <InputForm type="date" id="nacimiento" name="nacimiento" placeholder="dd/mm/aaaa" onChange={handleChangeG} required={true} />
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="filiacion" label="Filiación" />
              <InputForm type="text" id="filiacion" name="filiacion" placeholder="Filiación del paciente" onChange={handleChangeG} />
            </ColumnContainer>
            <RowsContainer columns="3" columnsGap="4">
              <ColumnContainer mb="0" mt="0" py="0" px="2">
                <LabelForm label="Genero" />
              </ColumnContainer>
              <ColumnContainer mb="0" mt="0" py="0" px="1">
                <LabelForm htmlFor="generom" label="Mujer" />
                <ToggleSwitchForm
                  id="generom" name="generom" value="M" onChange={handleChangeG} required={true} isChecked={genero} />
              </ColumnContainer>
              <ColumnContainer mb="0" mt="0" py="0" px="1">
                <LabelForm htmlFor="generoh" label="Hombre" />
                <ToggleSwitchForm id="generoh" name="generoh" value="H" onChange={handleChangeG} required={true} isChecked={!genero} />
              </ColumnContainer>
            </RowsContainer>
            <RowsContainer columns="3" columnsGap="10">
              <ColumnContainer mb="0" mt="0" py="0" px="2">
                <LabelForm label="Embarazo" />
              </ColumnContainer>
              <ColumnContainer mb="0" mt="0" py="0" px="1">
                <LabelForm htmlFor="embarazos" label="si" />
                <ToggleSwitchForm id="embarazos" name="embarazos" value="true" onChange={handleChangeG} disabled={!genero} isChecked={embarazo} />
                <LabelForm label="Semanas de gestación" />
                <InputForm type="number" id="semanas" key="semanas" name="semanas" disabled={!genero} onChange={handleChangeG} />
              </ColumnContainer>
              <ColumnContainer mb="0" mt="0" py="0" px="1">
                <LabelForm htmlFor="embarazon" label="no" />
                <ToggleSwitchForm id="embarazon" name="embarazon" value="false" isChecked={!embarazo} disabled={!genero} onChange={handleChangeG} />
              </ColumnContainer>
            </RowsContainer>

            <Title textAlign="center" title="Esquema de vacunación" />
            <RowsContainer columns={2}>
              <ColumnContainer>
                <LabelForm htmlFor="numero_dosis" label="Número de dosis" />
                <InputForm type="number" id="numero_dosis" name="numero_dosis" placeholder="0" onChange={handleChangeG} />
              </ColumnContainer>
              {dosis.map((numero) => {
                return (
                  <RowsContainer columns={2}>
                    <ColumnContainer>
                      <LabelForm htmlFor={"d_" + numero} label={"Dosis No. " + numero} />
                      <SelectForm id={numero} key={numero} name={"d_" + numero} onChange={handleChangeG} >
                        <OptionSelectForm defaultValue="">
                          Seleccione una vacuna
                        </OptionSelectForm>
                        {vacunas.map((vacuna) => {
                          return (
                            <OptionSelectForm key={vacuna.id} id={vacuna.id} value={vacuna.id} >
                              {vacuna.nombre}
                            </OptionSelectForm>
                          );
                        })}

                      </SelectForm>
                    </ColumnContainer>
                    <ColumnContainer>
                      <LabelForm htmlFor="aplicacion" label="Fecha de aplicación" />
                      <InputForm type="date" id="aplicacion" name="aplicacion" placeholder="dd/mm/aaaa" onChange={handleChangeG} />
                    </ColumnContainer>
                  </RowsContainer>
                );
              })}
            </RowsContainer>

            <Title textAlign="center" title="Antecedentes" />
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <LabelForm htmlFor="antecentedes" label="Antecentedes" />
              <Multiselect name="antecentedes" options={antecedentes} onSelect={onSelect} onRemove={onRemove} displayValue="nombre" placeholder="Escriba un antecedente" required={true}/>
            </ColumnContainer>

            <Title textAlign="center" title="Síntomas Principales" />
            <LabelForm label="Casos Sospechosos" />
            <LabelForm label="Persona de cualquier edad que en los últimos 7 días haya presentado al menos dos de los siguientes:" />

            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
                <ColumnContainer mb="0" mt="0" py="0" px="2">
                  <LabelForm htmlFor="inicio_sintomas" label="Inicio de Síntomas" />
                  <InputForm type="date" id="inicio_sintomas" name="inicio_sintomas" value={valuesG.inicio_sintomas} placeholder="dd/mm/aaaa" onChange={handleChangeG} required={true} />
                </ColumnContainer>

                <Table head={tableHeadSintomas}>
                  {sPrincipales.map((principal, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td key={index + "0"} className="px-6 py-4 border">
                          {principal.nombre}
                        </td>
                        <td key={index + "1"} className="px-6 py-4 w-12 h-12 border" >
                          {
                            <InputForm className="w-6 h-6 rounded" type="checkbox" id={principal.csintoma_id} name={principal.csintoma_id} onChange={handleChangePrincipales} />
                          }
                        </td>
                        <td key={index + "2"} className="px-6 py-4 border" style={{ display: "none" }} >
                          {index + 1}
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              </div>
            </ColumnContainer>

            <LabelForm label="Acompañado de al menos uno de los siguientes síntomas:" />
            <Title textAlign="center" title="Síntomas Secundarios" />
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
                <Table head={tableHeadSintomas}>
                  {sSecundarios.map((secundario, index) => {
                    return (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" >
                        <td key={index + "0"} className="px-6 py-4 border">
                          {secundario.nombre}
                        </td>
                        <td key={index + "1"} className="px-6 py-4 w-6 h-6 border" >
                          {
                            <InputForm className="w-6 h-6 rounded" type="checkbox" id={secundario.csintoma_id} name={secundario.csintoma_id} onChange={handleChangeSecundarios} />
                          }
                        </td>
                        <td key={index + "2"} className="px-6 py-4 border" style={{ display: "none" }} >
                          {index + 1}
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              </div>
            </ColumnContainer>
            <ColumnContainer>
              <LabelForm htmlFor="definicion" label="Cuenta con definición operacional COVID-19" />
              <InputForm type="checkbox" className="w-6 h-6 rounded" id="definicion" name="definicion" onChange={handleChangeG} />
            </ColumnContainer>
          </RowsContainer>
          <RowsContainer columns={3}>
          {cVitales.map((vital) => {
            return (
              <ColumnContainer>
                <LabelForm htmlFor={"v_" + vital.cconstante_vital_id} label={vital.abreviatura + "-" + vital.nombre} />
                <InputForm type="number" id={vital.cconstante_vital_id} key={vital.cconstante_vital_id} name={"v_" + vital.cconstante_vital_id} onChange={handleChangeVitales} />
              </ColumnContainer>
            );
          })}
          </RowsContainer>
          <RowsContainer columns={3}>
          {eAlerta.map((alerta) => {
            return (
              <ColumnContainer mb="0" mt="0" py="0" px="2" key={alerta.cestado_alerta_id}>
                <LabelForm htmlFor={"e_" + alerta.cestado_alerta_id} label={alerta.abreviatura + "-" + alerta.nombre} />
                <SelectForm id={alerta.cestado_alerta_id} key={alerta.cestado_alerta_id} name={"e_" + alerta.cestado_alerta_id} onChange={handleChangeAlerta.bind(this)} required={true} >
                  <OptionSelectForm defaultValue="">
                    Seleccione una opción
                  </OptionSelectForm>
                  {alerta.opciones.map((opcionA) => {
                    return (
                      <OptionSelectForm key={opcionA.cestado_alerta_opcion_id} id={opcionA.cestado_alerta_opcion_id} value={opcionA.cestado_alerta_opcion_id} >
                        {opcionA.nombre}
                      </OptionSelectForm>
                    );
                  })}
                </SelectForm>
              </ColumnContainer>
            );
          })}
          </RowsContainer>
          <div className="pt-20 pb-5 mx-2">
            <div className="w-full border-t border-1 border-gray-400"></div>
          </div>
          <RowsContainer columns="3" columnsGap="4">
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <p
                id="news2anuncio" name="news2anuncio" className={statusClases[news2]} >
                {statusMensajes[news2]}
              </p>
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <p id="qsofaanuncio" name="qsofaanuncio" className={statusClases[qsofa]} >
                {statusMensajes[qsofa]}
              </p>
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <p id="glassgowanuncio" name="glassgowanuncio" className={statusClases[glassgow]} >
                {statusMensajes[glassgow]}
              </p>
            </ColumnContainer>
          </RowsContainer>
          <RowsContainer columns="3" columnsGap="4">
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <p id="news2" name="news2" className="pt-2 pb-5 mx-2 text-center">
                News2
              </p>
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <p id="qsofa" name="qsofa" className="pt-2 pb-5 mx-2 text-center">
                QSofa
              </p>
            </ColumnContainer>
            <ColumnContainer mb="0" mt="0" py="0" px="2">
              <p id="glassgow" name="glassgow" className="pt-2 pb-5 mx-2 text-center" >
                Glassgow
              </p>
            </ColumnContainer>
          </RowsContainer>
          <div className="pt-2 pb-5 mx-2">
            <div className="w-full border-t border-1 border-gray-400"></div>
          </div>

          <ColumnContainer mb="0" mt="0" py="4" px="4">
            <div className="d-flex justify-content-center">
              <button onClick={handleRecalcular} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                Recalcular
              </button>
            </div>
          </ColumnContainer>

          <div className="pt-2 pb-5 mx-2">
            <div className="w-full border-t border-1 border-gray-400"></div>
          </div>

          <ColumnContainer mb="0" mt="0" py="0" px="2" className="d-flex justify-content-center" >
            <SubmitButtonForm>
              <SaveIcon w="5" h="5" />
              Enviar
            </SubmitButtonForm>
          </ColumnContainer>
        </form>
      </CenteredContainer>
    </>
  );
};

export default FormularioTriage;
