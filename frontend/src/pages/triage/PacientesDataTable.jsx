import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

import useAuth from '../../hooks/useAuth';
import { activate_user, delete_user } from '../../api/users';

import { Table, TableRow, TableCol } from "../../components/layout/Table";
import { LightButton } from '../../components/layout/Buttons';
import { SelectContentForm, OptionSelectForm, InputSearchForm } from '../../components/layout/Form';
import { RowsContainer, ColumnContainer } from "../../components/layout/Container";

import Pagination from '../../utils/Pagination';

// rutas para editar/actualizar usuario
const NEW_PACIENTE_URL = '/sedesa/triage'
const EDIT_PACIENTE_URL = 'editar' // ruta absoluta: /sedesa/usuarios/actualizacion

const PacientesDataTable = ( { pacientes, setPacientes }) => {
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [postsPerPage, setPostsPerPage] = useState(5);
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
        pacientes.sort((a, b) => {
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
        { id: 'numero', text: 'No.' },
        { id: 'nombre', text: 'Nombre', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'fecha_registro', text: 'Fecha de Registro', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'genero', text: 'Genero', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'fecha_nacimiento', text: 'Fecha de nacimiento', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'edad', text: 'Edad' },
        { id: 'fecha_inicio_sintomas', text: 'Fecha de Inicio de Síntomas' },
        { id: 'embarazo', text: 'Embarazo', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'semanas_gestacion', text: 'Semanas de Gestación' },
        { id: 'filiacion', text: 'Filiación', className: 'text-center' },
        { id: 'puntaje_news2', text: 'Puntaje NEWS2', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'puntaje_qsofq', text: 'Puntaje Qsofa', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'puntaje_glassgow', text: 'Puntaje Glassgow', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'sospecha_covid', text: 'Sospecha COVID', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'hospital', text: 'Hospital' },
        { id: 'hospital_corto', text: 'Hospital Abreviado', className: 'text-center' },
        { id: 'elaborado', text: 'Elaborado por', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'genero', text: 'Genero', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'sintomas', text: 'Síntomas', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'antecedentes', text: 'Antecedentes', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'estados_alerta', text: 'Estados de Alerta', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'constantes_vitales', text: 'Constantes Vitales', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        
    ]

    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <ColumnContainer>
                    <Link to={NEW_PACIENTE_URL}>
                        <LightButton text='Registrar nuevo paciente'>
                            <i class="text-md bi bi-person-plus-fill"></i>&nbsp;
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
                        <OptionSelectForm key="10_reg" id="10_reg" value="10">10 registros</OptionSelectForm>
                        <OptionSelectForm key="25_reg" id="25_reg" value="25">25 registros</OptionSelectForm>
                        <OptionSelectForm key="50_reg" id="50_reg" value="50">50 registros</OptionSelectForm>
                        <OptionSelectForm key="100_reg" id="100_reg" value="100">100 registros</OptionSelectForm>
                    </SelectContentForm>
                </ColumnContainer>
            </div>
            <RowsContainer columns={1}>
                <Table head={tableHead}>
                    {pacientes.slice(
                            (currentPage * postsPerPage) - postsPerPage, currentPage * postsPerPage
                    ).filter((paciente) => {
                        if (searchTerm.trim() === "") return (paciente);
                        else if (
                            paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            paciente.filiacion.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            paciente.genero.toLowerCase().includes(searchTerm.toLowerCase())
                        ) return (paciente)
                    }).map((paciente, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCol key={index+'0'} border='border-r'>{index+1}</TableCol>
                                <TableCol key={index+'1'} textAlign="text-center" border='border-r'>{paciente.nombre}</TableCol>
                                <TableCol key={index+'2'} border='border-r'>{paciente.fecha_registro}</TableCol>
                                <TableCol key={index+'3'} border='border-r'>{paciente.genero}</TableCol>
                                <TableCol key={index+'4'} textAlign="text-center">{paciente.fecha_nacimiento}</TableCol>
                                <TableCol key={index+'5'} border='border-r'>{paciente.edad}</TableCol>
                                <TableCol key={index+'6'} border='border-r'>{paciente.fecha_inicio_sintomas}</TableCol>
                                <TableCol key={index+'7'} textAlign="text-center">{paciente.embarazo}</TableCol>
                                <TableCol key={index+'8'} border='border-r'>{paciente.semanas_gestacion}</TableCol>
                                <TableCol key={index+'9'} border='border-r'>{paciente.filiacion}</TableCol>
                                <TableCol key={index+'10'} textAlign="text-center">{paciente.puntaje_news2}</TableCol>
                                <TableCol key={index+'11'} border='border-r'>{paciente.puntaje_qsofa}</TableCol>
                                <TableCol key={index+'12'} border='border-r'>{paciente.puntaje_glassgow}</TableCol>
                                <TableCol key={index+'13'} textAlign="text-center">{paciente.sospecha_covid}</TableCol>
                                <TableCol key={index+'14'} border='border-r'>{paciente.hospital}</TableCol>
                                <TableCol key={index+'15'} border='border-r'>{paciente.hospital_corto}</TableCol>
                                <TableCol key={index+'16'} textAlign="text-center">{paciente.elaborado}</TableCol>
                                <TableCol key={index+'17'} border='border-r'>{paciente.elaborado}</TableCol>
                                <TableCol key={index+'18'} border='border-r'>{paciente.elaborado}</TableCol>
                                <TableCol key={index+'19'} textAlign="text-center">{paciente.elaborado}</TableCol>
                                <TableCol key={index+'20'} border='border-r'>{paciente.elaborado}</TableCol>
                            </TableRow>
                        );
                    })}
                </Table>
            </RowsContainer>
            <RowsContainer columns={1}>
                <Pagination 
                    postsPerPage={postsPerPage} 
                    totalPosts={pacientes.length} 
                    paginate={paginate} 
                    currentPage={currentPage} 
                />
            </RowsContainer>
        </>
    );
};

export default PacientesDataTable;