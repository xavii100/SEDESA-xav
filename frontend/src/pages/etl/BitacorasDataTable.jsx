import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

import useAuth from '../../hooks/useAuth';

import { Table, TableRow, TableCol } from "../../components/layout/Table";
import { LightButton } from '../../components/layout/Buttons';
import { SelectContentForm, OptionSelectForm, InputSearchForm } from '../../components/layout/Form';
import { RowsContainer, ColumnContainer } from "../../components/layout/Container";

import Pagination from '../../utils/Pagination';

const BitacorasDataTable = ( { bitacora, setBitacora }) => {
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [sortTerm, setSortTerm] = useState('');

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
        bitacora.sort((a, b) => {
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
        { id: 'tetl_reporte_historico_id', text: 'ID', className: 'text-center' },
        { id: 'fecha', text: 'Fecha', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'tipo', text: 'Tipo', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'log', text: 'Log', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'estatus', text: 'Estatus', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'nombre_usuario', text: 'Usuario', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) }
    ]

    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <ColumnContainer>
                    <div class="text-xs text-gray-700 bg-gray-50 border rounded-lg p-3">
                        <div>
                            <span class="text-sm">
                                <i class="bi bi-file-earmark-check-fill text-green-600"></i>
                            </span>
                            <span class="pl-1">Cargado: el archivo se agregó correctamente al sistema.</span>
                        </div>
                        <div>
                            <span class="text-sm">
                                <i class="bi bi-file-earmark-minus-fill text-yellow-500"></i>
                            </span>
                            <span class="pl-1">No cargado: ocurrió un error durante la carga del archivo.</span>
                        </div>
                        <div>
                            <span class="text-sm">
                                <i class="bi bi-file-earmark-x-fill text-red-600"></i>
                            </span>
                            <span class="pl-1">Error: el archivo está dañado y no se pudo cargar.</span>
                        </div>
                    </div>
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
                    {bitacora.slice(
                            (currentPage * postsPerPage) - postsPerPage, currentPage * postsPerPage
                    ).filter((bitacora) => {
                        if (searchTerm.trim() === "") return (bitacora);
                        else {
                            let stringSearch = '';

                            if (bitacora.tetl_reporte_historico_id !== null && bitacora.tetl_reporte_historico_id !== '') stringSearch += bitacora.tetl_reporte_historico_id + ' ';
                            if (bitacora.fecha !== null && bitacora.fecha.trim() !== '') stringSearch += bitacora.fecha + ' ';
                            if (bitacora.tipo !== null && bitacora.tipo.trim() !== '') stringSearch += bitacora.tipo + ' ';
                            if (bitacora.log !== null && bitacora.log.trim() !== '') stringSearch += bitacora.log + ' ';
                            if (bitacora.estatus !== null && bitacora.estatus.trim() !== '') stringSearch += bitacora.estatus + ' ';
                            if (bitacora.nombre_usuario !== null && bitacora.nombre_usuario !== '') stringSearch += bitacora.nombre_usuario + ' ';

                            stringSearch = stringSearch.trim();

                            if (stringSearch.toLowerCase().includes(searchTerm.toLowerCase())) return (bitacora);
                        }
                    }).map((bitacora, index) => {
                        let estatusTxt = '';
                        switch (bitacora.estatus) {
                            case 'cargado':
                                estatusTxt = `
                                    <span class="text-xl">
                                        <i class="bi bi-file-earmark-check-fill text-green-600"></i>
                                    </span>
                                    <span class="pl-3">Cargado</span>`;
                            break;

                            case 'no cargado':
                                estatusTxt = `
                                    <span class="text-xl">
                                        <i class="bi bi-file-earmark-minus-fill text-yellow-500"></i>
                                    </span>
                                    <span class="pl-3">No cargado</span>`;
                            break;

                            case 'error':
                                estatusTxt = `
                                    <span class="text-xl">
                                        <i class="bi bi-file-earmark-x-fill text-red-600"></i>
                                    </span>
                                    <span class="pl-3">Error</span>`;
                            break;
                        
                            default:
                                estatusTxt = '-';
                            break;
                        }

                        return (
                            <TableRow key={index}>
                                <TableCol key={index+'0'} textAlign="text-center" border='border-r'>{bitacora.tetl_reporte_historico_id}</TableCol>
                                <TableCol key={index+'2'} border='border-r'>{bitacora.fecha}</TableCol>
                                <TableCol key={index+'1'} border='border-r'>{bitacora.tipo}</TableCol>
                                <TableCol key={index+'4'} border='border-r'>{bitacora.log}</TableCol>
                                <TableCol key={index+'5'} border='border-r'>
                                    <div dangerouslySetInnerHTML={{ __html: estatusTxt }} />
                                </TableCol>
                                <TableCol key={index+'6'} border='border-r'>{bitacora.nombre_usuario}</TableCol>
                            </TableRow>
                        );
                    })}
                </Table>
            </RowsContainer>
            <RowsContainer columns={1}>
                <Pagination 
                    postsPerPage={postsPerPage} 
                    totalPosts={bitacora.length} 
                    paginate={paginate} 
                    currentPage={currentPage} 
                />
            </RowsContainer>
        </>
    );
};

export default BitacorasDataTable;