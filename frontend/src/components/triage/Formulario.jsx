import React, {useEffect, useState} from 'react'

import { get_all_triage } from '../../api/triage';


//Aquí va todo el formulario
const Formulario = () => {

  const [sPrincipales, setsPrincipales] = useState([]);
  const [sSecundarios, setsSecundarios] = useState([]);
  const [cVitales, setcVitales] = useState([]);
  const [antecedentesD, setantecedentesD] = useState([]);
  const [eAlerta, seteAlerta] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await get_all_triage();
      setsPrincipales(() => data.sintomas_principales);
      setsSecundarios(() => data.sintomas_secundarios);
      setcVitales(() => data.constantes_vitales);
      setantecedentesD(() => data.antecedentes);
      seteAlerta(() => data.estado_alerta);
    };
    getData();
    console.log(eAlerta)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
  <>
<div className="mt-5 md:mt-0 md:col-span-1">
    <h5 className="text-center">Triage Respiratorio</h5>
    <form action="#" method="POST">
    <div className="shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 bg-white sm:p-6">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="last-name"
              id="last-name"
              autoComplete="family-name"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

                <div className="col-span-1">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Filiación
                  </label>
                  <input
                    type="text"
                    name="filiacion"
                    id="filiacion"
                    autoComplete="given-name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Género
                  </label>
                  <div className="flex items-center">
                    <input className="border-gray-300 focus:border-blue-400"
                      id="push-everything"
                      name="push-notifications"
                      type="radio"
                    />
                    <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                      Mujer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push-email"
                      name="push-notifications"
                      type="radio"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                      Hombre
                    </label>
                  </div>
              <div className="col-span-2">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Embarazo
                  </label>
                <div className="flex items-center">
                    <input
                      id="push-everything1"
                      name="embarazo"
                      type="radio"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="push-everything1" className="ml-3 block text-sm font-medium text-gray-700">
                    Sí
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push-email"
                      name="embarazo"
                      type="radio"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="push-email1" className="ml-3 block text-sm font-medium text-gray-700">
                      No
                    </label>
                  </div>
                </div>    
                </div>

                <div className="col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Antecedentes
                  </label>
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option selected>Antecedente</option>
                    {antecedentesD.map(antecedente => {
                      return (
                        <option key={antecedente.cantecedente_id} id={antecedente.cantecedente_id} value={antecedente.cantecedente_id}>
                          {antecedente.nombre}
                        </option>
                      )
                    })}

                  </select>
                </div>

                <div className="col-span-1">
                  <label htmlFor="inicio-sintomas" className="block text-sm font-medium text-gray-700">
                    Inicio de Síntomas
                  </label>
                  <input
                    type="date"
                    name="inicio-sintomas"
                    id="inicio-sintomas"
                    autoComplete="inicio-sintomas"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
    </div>
              <div align="center">
              <p className="pt-4">Casos Sospechosos</p>
              <p className="pt-4">Persona de cualquier edad que en los últimos 7 días haya presentado al menos dos de los siguientes:</p>
                <table className="pt-4"> 
                  <caption className="pt-4">Síntomas Principales</caption>
                  <thead>
                    <tr>
                                <th> Síntoma </th>
                                <th> Selección </th>
                    </tr>
                  </thead>
                  <tbody>

                    {sPrincipales.map(principal => {
                      return (
                        <tr key={principal.csintoma_id}>
                          <td>
                            <div className="text-base font-medium text-gray-900" aria-hidden="true">
                            {principal.nombre}
                            </div>
                          </td>
                          <td>
                            <div className="ml-3 text-sm">
                              <label className="switch">
                                <input
                                id={principal.csintoma_id}
                                name={principal.csintoma_id}
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <span className="slider round"></span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      )
                    })}

                  </tbody>
                </table>
                </div>
                <div align="center" className="pt-4">
                <table>
                  <caption>Síntomas Secundarios</caption>
                  <thead>
                    <tr>
                                <th> Síntoma </th>
                                <th> Selección </th>
                    </tr>
                  </thead>
                  <tbody>

                  {sSecundarios.map(secundario => {
                      return (
                        <tr key={secundario.csintoma_id}>
                          <td>
                            <div className="text-base font-medium text-gray-900" aria-hidden="true">
                            {secundario.nombre}
                            </div>
                          </td>
                          <td>
                            <div className="ml-3 text-sm">
                              <label className="switch">
                                <input
                                id={secundario.csintoma_id}
                                name={secundario.csintoma_id}
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <span className="slider round"></span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      )
                    })}

                  </tbody>
                </table>
                </div>

          {/* Mediciones */}
          <div className="gap-5 columns-6 mx-8">
            {cVitales.map(vital => {
              return (
                <div className="col-span-1" key={vital.cconstante_vital_id}>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    {vital.abreviatura} - {vital.nombre}
                  </label>
                  <input
                    type="number"
                    name={vital.cconstante_vital_id}
                    id={vital.cconstante_vital_id}
                    autoComplete="given-name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              )
            })}
          </div>

          <div className="gap-5 columns-5 mx-8">
          {/* Estados de alerta */}

            {eAlerta.map(alerta => {
              return (
              <div className="col-span-1" key={alerta.cestado_alerta_id}>
                <label htmlFor="estado-alerta" className="block text-sm font-medium text-gray-700">
                {alerta.abreviatura} - {alerta.nombre}
                </label>
                <select
                  id={alerta.cestado_alerta_id}
                  name={alerta.cestado_alerta_id}
                  autoComplete="country-name"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {alerta.opciones.map(opcionA => {
                      return (
                        <option key={opcionA.cestado_alerta_opcion_id}>{opcionA.nombre}</option>
                      )
                    })}
                </select>
              </div>
              )
            })}
          </div>
                {/* BANDERAS  */}

                <div className="px-4 py-3 bg-gray-50 text-center">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Recalcular
              </button>
            </div>

    <div>

    <table align="center" className='table-fixed'>
                <thead data-v-311d0c2e="">
                  <tr data-v-311d0c2e="">
                    <th data-v-311d0c2e="" scope="col">NEWS2</th>
                    <th data-v-311d0c2e="" scope="col">QSOFA</th>
                    <th data-v-311d0c2e="" scope="col">Glassgow</th>
                  </tr>
                </thead>
                <tbody data-v-311d0c2e="">
                  <tr data-v-311d0c2e="">
                    <td data-v-311d0c2e="">
                      <div data-v-311d0c2e="" className="bandera col-12 alarma">
                        <span data-v-311d0c2e="" className="text-center mensaje">Alarma</span>
                      </div></td><td data-v-311d0c2e="">
                      <div data-v-311d0c2e="" className="bandera col-12 grave">
                        <span data-v-311d0c2e="" className="text-center mensaje">Normal</span>
                      </div></td><td data-v-311d0c2e=""><div data-v-311d0c2e="" className="bandera col-12 coma">
                        <span data-v-311d0c2e="" className="text-center mensaje">Coma</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
    </div>

  <div className="px-4 py-3 bg-gray-50 text-center">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enviar
            </button>
          </div>

  </form>
</div>
  </>
    )
  }

export default Formulario;