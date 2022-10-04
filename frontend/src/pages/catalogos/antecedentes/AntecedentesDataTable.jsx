import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

import useAuth from '../../../hooks/useAuth';
import { delete_antecedente } from '../../../api/catalogos';

import { Table, TableRow, TableCol } from "../../../components/layout/Table";
import { LightButton } from '../../../components/layout/Buttons';
import { SelectContentForm, OptionSelectForm, InputSearchForm } from '../../../components/layout/Form';
import { RowsContainer, ColumnContainer } from "../../../components/layout/Container";

import Pagination from '../../../utils/Pagination';

// Rutas para registrar/editar antecedente
const NEW_ANTECEDENTE_URL = '/sedesa/catalogos/antecedentes/registro'
const EDIT_ANTECEDENTE_URL = 'actualizacion' // ruta absoluta: /sedesa/catalogos/antecedentes/actualizacion

const AntecedentesDataTable = ( { antecedentes, setAntecedentes }) => {
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [sortTerm, setSortTerm] = useState('');

    // -----------------------------------------------------------------------------------------------------------------------
    // remover antecedente
    const handleRemoveAntecedente = (antecedente_ad) => {
        console.log(antecedente_ad);
        Swal.fire({
            title: "Eliminar antecedente",
            html: '¿Desea eliminar "'+antecedente_ad['name']+'"?<br>¡No podrá revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then( (result) => {
            if (result.isConfirmed) { // hicieron click en "Sí"
                const antecedenteDeleteManagement = async () => {
                    const { data } = await delete_antecedente(auth, {id_antecedente: antecedente_ad['antecedente_id']} );
                    Swal.fire(data.success, '', 'success')
                    const newAntecedentes = antecedentes.filter((antecedente) => antecedente.cantecedente_id !== antecedente_ad['antecedente_id']);
                    setAntecedentes(newAntecedentes);
                }
                antecedenteDeleteManagement();
            }
        });
    };
    
    // -----------------------------------------------------------------------------------------------------------------------

    // ordenamiento de registros
    function getOptionsToSort(e) {
        let record = e.target.getAttribute('id');
        let toggle = e.target.getAttribute('data-toggle');
        const sortRecords = { record: record, toggle: toggle, }
        setSortTerm(sortRecords);
        if (toggle === 'asc') e.target.setAttribute('data-toggle', 'desc');
        else e.target.setAttribute('data-toggle', 'asc');
    }
    
    if (sortTerm !== "") {
        antecedentes.sort((a, b) => {
            if (sortTerm['toggle'] === 'asc') return a[sortTerm['record']].localeCompare(b[sortTerm['record']]);
            else if (sortTerm['toggle'] === 'desc') return b[sortTerm['record']].localeCompare(a[sortTerm['record']]);
        });
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // paginación
    const handlePaginationChange = (e) => {
        setCurrentPage(1);
        setPostsPerPage(e.target.value);
    };

    const paginate = (numberPage) => {
        setCurrentPage(numberPage);
    }

    // -----------------------------------------------------------------------------------------------------------------------
    // columnas del encabezado de la tabla
    // el id es obligatorio y onClick cuando se desea orderna la tabla dando click en las celdas de los encabezados
    const tableHead = [
        // { id: 'numero', text: 'No.' },
        { id: 'acciones', text: 'Acciones', className: 'text-center' },
        { id: 'nombre', text: 'Antecedente', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'abreviatura', text: 'Abreviatura', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'sinonimos', text: 'Sinónimos', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'triage', text: 'Triage', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'antecedente_primario', text: 'Antecedente primario', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) }
    ]

    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <ColumnContainer>
                    <Link to={NEW_ANTECEDENTE_URL}>
                        <LightButton text='Registrar nuevo antecedente'>
                            <i class="text-md bi bi-plus-square-fill"></i>&nbsp;&nbsp;
                        </LightButton>
                    </Link>
                </ColumnContainer>
                <ColumnContainer>
                    <InputSearchForm 
                        id="userSearch"
                        name="userSearch"
                        placeholder="Escribe para filtrar registros"
                        onChange={ (e) => setSearchTerm(e.target.value) }
                    />
                </ColumnContainer>
                <ColumnContainer>
                    <SelectContentForm id="showRecords" name="showRecords" className="w-32 float-right" onChange={ (e) => handlePaginationChange(e) }>
                        <OptionSelectForm key="5_reg" id="5_reg" value="5">5 registros</OptionSelectForm>
                        <OptionSelectForm key="10_reg" id="10_reg" value="10" selected>10 registros</OptionSelectForm>
                        <OptionSelectForm key="25_reg" id="25_reg" value="25">25 registros</OptionSelectForm>
                        <OptionSelectForm key="50_reg" id="50_reg" value="50">50 registros</OptionSelectForm>
                        <OptionSelectForm key="100_reg" id="100_reg" value="100">100 registros</OptionSelectForm>
                    </SelectContentForm>
                </ColumnContainer>
            </div>
            <RowsContainer columns={1}>
                <Table head={tableHead}>
                    {antecedentes.slice(
                            (currentPage * postsPerPage) - postsPerPage, currentPage * postsPerPage
                    ).filter((antecedente) => {
                        if (searchTerm.trim() === "") return (antecedente);
                        else {
                            let stringSearch = '';

                            /* let sinonimosTxtBusqueda = '';

                            if (antecedente.sinonimos !== null) {
                                let longitud = antecedente.sinonimos.length;
                                antecedente.sinonimos.forEach((valor, indice) => {
                                    if (indice == longitud-1) sinonimosTxtBusqueda += valor;
                                    else sinonimosTxtBusqueda += `${valor}, `;
                                });
                            } */

                            if (antecedente.nombre !== null && antecedente.nombre.trim() !== '') stringSearch += antecedente.nombre + ' ';
                            if (antecedente.abreviatura !== null && antecedente.abreviatura.trim() !== '') stringSearch += antecedente.abreviatura + ' ';
                            if (antecedente.sinonimos !== null && antecedente.sinonimos !== '') stringSearch += antecedente.sinonimos + ' ';
                            // if (antecedente.triage !== null && antecedente.triage.trim() !== '') stringSearch += antecedente.triage + ' ';

                            stringSearch = stringSearch.trim();

                            if (stringSearch.toLowerCase().includes(searchTerm.toLowerCase())) return (antecedente);
                        }
                    }).map((antecedente, index) => {
                        /* let sinonimosTxt = '';

                        if (antecedente.sinonimos !== null) {
                            let longitud = antecedente.sinonimos.length;
                            antecedente.sinonimos.forEach((valor, indice) => {
                                if (indice == longitud-1) sinonimosTxt += valor;
                                else sinonimosTxt += `${valor}, `;
                            });
                        } */

                        let antecedentePrimarioTxt = '';
                        if (antecedente.cantecedente_primario_id !== null) { //Busco el nombre del antecedente primario
                            let obj = antecedentes.find(antecedenteFind => antecedenteFind.cantecedente_id == antecedente.cantecedente_primario_id);
                            antecedentePrimarioTxt = obj.nombre;
                        }
                        else { //No tiene antecedente primario
                            antecedentePrimarioTxt = 'N/A';
                        }

                        return (
                            <TableRow key={index}>
                                {/* <TableCol key={index+'0'} border='border-r'>{index+1}</TableCol> */}
                                <TableCol key={index+'0'} border='border-r' textAlign="text-center">
                                    <div className='inline-flex'>
                                        <Link to={EDIT_ANTECEDENTE_URL} state={{antecedenteid:antecedente.cantecedente_id}}>
                                            <span className="flex md:text-base lg:text-xl mr-2 md:mr-2 lg:mr-2 xl:mr-3 cursor-pointer font-bold text-center text-gray-500" title="Editar antecedente">
                                                <i class="bi bi-pencil-square font-bold"></i>
                                            </span>
                                        </Link>
                                        {/* <span className="flex md:text-base lg:text-xl cursor-pointer font-bold text-center text-gray-500" title="Eliminar hospital" onClick={ () => handleRemoveAntecedente({ antecedente_id: hospital.cantecedente_id, name:hospital.nombre }) }>
                                            <i class="bi bi-trash"></i>
                                        </span> */}
                                    </div>
                                </TableCol>
                                <TableCol key={index+'1'} textAlign="text-center" border='border-r'>{antecedente.nombre}</TableCol>
                                <TableCol key={index+'2'} border='border-r'>{antecedente.abreviatura}</TableCol>
                                <TableCol key={index+'3'} border='border-r'>{antecedente.sinonimos}</TableCol>
                                <TableCol key={index+'4'} border='border-r'>
                                    { antecedente.triage ? 'Sí' : 'No' }
                                </TableCol>
                                <TableCol key={index+'5'} textAlign="text-center" border='border-r'>{antecedentePrimarioTxt}</TableCol>
                            </TableRow>
                        );
                    })}
                </Table>
            </RowsContainer>
            <RowsContainer columns={1}>
                <Pagination 
                    postsPerPage={postsPerPage} 
                    totalPosts={antecedentes.length} 
                    paginate={paginate} 
                    currentPage={currentPage} 
                />
            </RowsContainer>
        </>
    );
};

export default AntecedentesDataTable;