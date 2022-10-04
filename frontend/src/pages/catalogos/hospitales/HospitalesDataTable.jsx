import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

import useAuth from '../../../hooks/useAuth';
import { delete_hospital } from '../../../api/catalogos';

import { Table, TableRow, TableCol } from "../../../components/layout/Table";
import { LightButton } from '../../../components/layout/Buttons';
import { SelectContentForm, OptionSelectForm, InputSearchForm } from '../../../components/layout/Form';
import { RowsContainer, ColumnContainer } from "../../../components/layout/Container";

import Pagination from '../../../utils/Pagination';

// Rutas para registrar/editar hospital
const NEW_HOSPITAL_URL = '/sedesa/catalogos/hospitales/registro'
const EDIT_HOSPITAL_URL = 'actualizacion' // ruta absoluta: /sedesa/catalogos/hospitales/actualizacion

const HospitalesDataTable = ( { hospitales, setHospitales }) => {
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [sortTerm, setSortTerm] = useState('');

    // -----------------------------------------------------------------------------------------------------------------------
    // remover hospital
    const handleRemoveHospital = (hospital_ad) => {
        console.log(hospital_ad);
        Swal.fire({
            title: "Eliminar hospital",
            html: '¿Desea eliminar "'+hospital_ad['name']+'"?<br>¡No podrá revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then( (result) => {
            if (result.isConfirmed) { // hicieron click en "Sí"
                const hospitalDeleteManagement = async () => {
                    const { data } = await delete_hospital(auth, {id_hospital: hospital_ad['hospital_id']} );
                    Swal.fire(data.success, '', 'success')
                    const newHospitales = hospitales.filter((hospital) => hospital.thospital_id !== hospital_ad['hospital_id']);
                    setHospitales(newHospitales);
                }
                hospitalDeleteManagement();
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
        hospitales.sort((a, b) => {
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
        // { id: 'email', text: 'Email', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        // { id: 'nombre_usuario', text: 'Nombre Hospital', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'nombre_hospital', text: 'Hospital', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'nombre_corto', text: 'Nombre corto', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'direccion', text: 'Dirección', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'clues', text: 'Clues', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'cp', text: 'CP', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'atiende_covid19', text: 'COVID-19', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        // { id: 'rol', text: 'Rol Hospital', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
    ]

    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <ColumnContainer>
                    <Link to={NEW_HOSPITAL_URL}>
                        <LightButton text='Registrar nuevo hospital'>
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
                    {hospitales.slice(
                            (currentPage * postsPerPage) - postsPerPage, currentPage * postsPerPage
                    ).filter((hospital) => {
                        if (searchTerm.trim() === "") return (hospital);
                        else {
                            let stringSearch = '';

                            if (hospital.nombre !== null && hospital.nombre.trim() !== '') stringSearch += hospital.nombre + ' ';
                            if (hospital.nombre_corto !== null && hospital.nombre_corto.trim() !== '') stringSearch += hospital.nombre_corto + ' ';
                            if (hospital.direccion !== null && hospital.direccion.trim() !== '') stringSearch += hospital.direccion + ' ';
                            if (hospital.clues !== null && hospital.clues.trim() !== '') stringSearch += hospital.clues + ' ';
                            if (hospital.cp !== null && hospital.cp !== '') stringSearch += hospital.cp + ' ';

                            stringSearch = stringSearch.trim();

                            if (stringSearch.toLowerCase().includes(searchTerm.toLowerCase())) return (hospital);
                        }
                    }).map((hospital, index) => {
                        return (
                            <TableRow key={index}>
                                {/* <TableCol key={index+'0'} border='border-r'>{index+1}</TableCol> */}
                                <TableCol key={index+'0'} border='border-r' textAlign="text-center">
                                    <div className='inline-flex'>
                                        <Link to={EDIT_HOSPITAL_URL} state={{hospitalid:hospital.thospital_id}}>
                                            <span className="flex md:text-base lg:text-xl mr-2 md:mr-2 lg:mr-2 xl:mr-3 cursor-pointer font-bold text-center text-gray-500" title="Editar hospital">
                                                <i class="bi bi-pencil-square font-bold"></i>
                                            </span>
                                        </Link>
                                        {/* <span className="flex md:text-base lg:text-xl cursor-pointer font-bold text-center text-gray-500" title="Eliminar hospital" onClick={ () => handleRemoveHospital({ hospital_id: hospital.thospital_id, name:hospital.nombre }) }>
                                            <i class="bi bi-trash"></i>
                                        </span> */}
                                    </div>
                                </TableCol>
                                <TableCol key={index+'1'} textAlign="text-center" border='border-r'>{hospital.nombre}</TableCol>
                                <TableCol key={index+'2'} border='border-r'>{hospital.nombre_corto}</TableCol>
                                <TableCol key={index+'3'} border='border-r'>{hospital.direccion}</TableCol>
                                <TableCol key={index+'4'} border='border-r'>{hospital.clues}</TableCol>
                                <TableCol key={index+'5'} border='border-r'>{hospital.cp}</TableCol>
                                <TableCol key={index+'6'} border='border-r'>
                                    { hospital.atiende_covid19 ? 'Sí' : 'No' }
                                </TableCol>
                                { /* <TableCol key={index+'5'} textAlign="text-center">{hospital.rol}</TableCol> */ }
                            </TableRow>
                        );
                    })}
                </Table>
            </RowsContainer>
            <RowsContainer columns={1}>
                <Pagination 
                    postsPerPage={postsPerPage} 
                    totalPosts={hospitales.length} 
                    paginate={paginate} 
                    currentPage={currentPage} 
                />
            </RowsContainer>
        </>
    );
};

export default HospitalesDataTable;