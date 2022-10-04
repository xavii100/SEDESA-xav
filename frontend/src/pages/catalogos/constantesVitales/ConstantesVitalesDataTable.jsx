import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

import useAuth from '../../../hooks/useAuth';
import { delete_constantevital } from '../../../api/catalogos';

import { Table, TableRow, TableCol } from "../../../components/layout/Table";
import { LightButton } from '../../../components/layout/Buttons';
import { SelectContentForm, OptionSelectForm, InputSearchForm } from '../../../components/layout/Form';
import { RowsContainer, ColumnContainer } from "../../../components/layout/Container";

import Pagination from '../../../utils/Pagination';

// Rutas para registrar/editar constante vital
const NEW_CONSTANTEVITAL_URL = '/sedesa/catalogos/constantesvitales/registro'
const EDIT_CONSTANTEVITAL_URL = 'actualizacion' // ruta absoluta: /sedesa/catalogos/constantesvitales/actualizacion

const ConstantesVitalesDataTable = ( { constantesVitales, setConstantesVitales }) => {
    // console.log('constantesVitales', constantesVitales);
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [sortTerm, setSortTerm] = useState('');

    // -----------------------------------------------------------------------------------------------------------------------
    // remover constante vital
    const handleRemoveConstanteVital = (constanteVital_ad) => {
        // console.log(constanteVital_ad);
        Swal.fire({
            title: "Eliminar constante vital",
            html: '¿Desea eliminar "'+constanteVital_ad['name']+'"?<br>¡No podrá revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then( (result) => {
            if (result.isConfirmed) { // hicieron click en "Sí"
                const constanteVitalDeleteManagement = async () => {
                    const { data } = await delete_constantevital(auth, {id_constanteVital: constanteVital_ad['constanteVital_id']} );
                    Swal.fire(data.success, '', 'success')
                    const newConstantesVitales = constantesVitales.filter((constanteVital) => constanteVital.cconstante_vital_id !== constanteVital_ad['constanteVital_id']);
                    setConstantesVitales(newConstantesVitales);
                }
                constanteVitalDeleteManagement();
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
        constantesVitales.sort((a, b) => {
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
        { id: 'nombre', text: 'Constante vital', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'abreviatura', text: 'Abreviatura', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'min', text: 'Mínimo', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'max', text: 'Máximo', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'alerta_menor_que', text: 'Alerta menor que', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'alerta_mayor_que', text: 'Alerta mayor que', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) }
    ]

    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <ColumnContainer>
                    <Link to={NEW_CONSTANTEVITAL_URL}>
                        <LightButton text='Registrar nueva constante vital'>
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
                    {constantesVitales.slice(
                            (currentPage * postsPerPage) - postsPerPage, currentPage * postsPerPage
                    ).filter((constanteVital) => {
                        if (searchTerm.trim() === "") return (constanteVital);
                        else {
                            let stringSearch = '';

                            if (constanteVital.nombre !== null && constanteVital.nombre.trim() !== '') stringSearch += constanteVital.nombre + ' ';
                            if (constanteVital.abreviatura !== null && constanteVital.abreviatura.trim() !== '') stringSearch += constanteVital.abreviatura + ' ';
                            if (constanteVital.min !== null && constanteVital.min !== '') stringSearch += constanteVital.min + ' ';
                            if (constanteVital.max !== null && constanteVital.max !== '') stringSearch += constanteVital.max + ' ';
                            if (constanteVital.alerta_menor_que !== null && constanteVital.alerta_menor_que !== '') stringSearch += constanteVital.alerta_menor_que + ' ';
                            if (constanteVital.alerta_mayor_que !== null && constanteVital.alerta_mayor_que !== '') stringSearch += constanteVital.alerta_mayor_que + ' ';

                            stringSearch = stringSearch.trim();

                            if (stringSearch.toLowerCase().includes(searchTerm.toLowerCase())) return (constanteVital);
                        }
                    }).map((constanteVital, index) => {
                        return (
                            <TableRow key={index}>
                                {/* <TableCol key={index+'0'} border='border-r'>{index+1}</TableCol> */}
                                <TableCol key={index+'0'} border='border-r' textAlign="text-center">
                                    <div className='inline-flex'>
                                        <Link to={EDIT_CONSTANTEVITAL_URL} state={{constanteVitalid:constanteVital.cconstante_vital_id}}>
                                            <span className="flex md:text-base lg:text-xl mr-2 md:mr-2 lg:mr-2 xl:mr-3 cursor-pointer font-bold text-center text-gray-500" title="Editar constante vital">
                                                <i class="bi bi-pencil-square font-bold"></i>
                                            </span>
                                        </Link>
                                        {/* <span className="flex md:text-base lg:text-xl cursor-pointer font-bold text-center text-gray-500" title="Eliminar constante vital" onClick={ () => handleRemoveConstanteVital({ constanteVital_id: constanteVital.cconstante_vital_id, name:constanteVital.nombre }) }>
                                            <i class="bi bi-trash"></i>
                                        </span> */}
                                    </div>
                                </TableCol>
                                <TableCol key={index+'1'} textAlign="text-center" border='border-r'>{constanteVital.nombre}</TableCol>
                                <TableCol key={index+'2'} border='border-r'>{constanteVital.abreviatura}</TableCol>
                                <TableCol key={index+'3'} border='border-r'>{constanteVital.min}</TableCol>
                                <TableCol key={index+'4'} border='border-r'>{constanteVital.max}</TableCol>
                                <TableCol key={index+'5'} border='border-r'>{constanteVital.alerta_menor_que}</TableCol>
                                <TableCol key={index+'6'} border='border-r'>{constanteVital.alerta_mayor_que}</TableCol>
                            </TableRow>
                        );
                    })}
                </Table>
            </RowsContainer>
            <RowsContainer columns={1}>
                <Pagination 
                    postsPerPage={postsPerPage} 
                    totalPosts={constantesVitales.length} 
                    paginate={paginate} 
                    currentPage={currentPage} 
                />
            </RowsContainer>
        </>
    );
};

export default ConstantesVitalesDataTable;