import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

import Swal from 'sweetalert2'

import { MainContainer } from '../../components/layout/Container';
import { Table, TableRow, TableCol } from "../../components/layout/Table";
import { LightButton } from '../../components/layout/Buttons';
import { SelectContentForm, OptionSelectForm, InputSearchForm } from '../../components/layout/Form';
import { RowsContainer, ColumnContainer } from "../../components/layout/Container";

import Pagination from '../../utils/Pagination';
import PermissionsDetail from '../../components/roles/PermissionsDetail';

const UsersDataTable = ( { roles, setRoles }) => {
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
        roles.sort((a, b) => {
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
        { id: 'acciones', text: 'Acciones', className: 'text-center' },
        { id: 'rol', text: 'Nombre del Rol', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'admin', text: 'Tipo', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { text: 'Permisos', className: 'text-center cursor-pointer' },
    ]

    // const actionIcons = {
    //     crear: '<i className="bi bi-plus-circle ml-2"></i>',
    //     editar: '<i className="bi bi-pencil-square ml-2"></i>',
    //     listar: '<i className="bi bi-table ml-2"></i>',
    // }

    return (
        <MainContainer>
            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <ColumnContainer>
                    <div className="flex">
                        <span className='flex-inline text-sm text-gray-500'><strong>Acciones:</strong></span>
                        <ul className='text-sm text-gray-500 flex flex-inline'>
                            <li className='ml-2'><i className="bi bi-plus-circle ml-2"></i> Crear,</li>
                            <li className='ml-2'><i className="bi bi-pencil-square ml-2"></i> editar,</li>
                            <li className='ml-2'><i className="bi bi-table ml-2"></i> listar.</li>
                        </ul>
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
                        <OptionSelectForm id="10_reg" value="10">10 registros</OptionSelectForm>
                        <OptionSelectForm id="25_reg" value="25">25 registros</OptionSelectForm>
                        <OptionSelectForm id="50_reg" value="50">50 registros</OptionSelectForm>
                        <OptionSelectForm id="100_reg" value="100">100 registros</OptionSelectForm>
                    </SelectContentForm>
                </ColumnContainer>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                <ColumnContainer>
                <Table head={tableHead}>
                    {roles.slice(
                            (currentPage * postsPerPage) - postsPerPage, currentPage * postsPerPage
                    ).filter((rol) => {
                        if (searchTerm.trim() === "") return (rol);
                        else if ( rol.rol.toLowerCase().includes(searchTerm.toLowerCase()) ) return (rol)
                    }).map((rol, index) => {
                        return (
                            <tr key={'row'+index.toString()} className="bg-white border-t hover:bg-gray-50">
                                <TableCol idRow={index} idCell={0} border='border-r'>{index+1}</TableCol>
                                <TableCol idRow={index} idCell={1} border='border-r' textAlign="text-center">
                                    <Link to="editar" state={ {crol_id:rol.crol_id} }>
                                        <span className="text-2xl mr-3 cursor-pointer font-bold text-center text-gray-500" title="Editar Usuario">
                                            <i className="bi bi-pencil-square font-bold"></i>
                                        </span>
                                    </Link>
                                </TableCol>
                                <TableCol idRow={index} idCell={2} textAlign="text-center" border='border-r'>{rol.rol}</TableCol>
                                <TableCol idRow={index} idCell={3} textAlign="text-center" border='border-r'>
                                    <span className="text-center md:text-base lg:text-xl mr-2 md:mr-2 lg:mr-2 xl:mr-3 font-bold text-center text-gray-500" title={rol.admin === 'a' ? "Administrador" : "Usuario"}>
                                        {rol.admin === 'a' ? <i className="bi bi-unlock"></i> : <i className="bi bi-lock"></i>}
                                    </span>
                                </TableCol>
                                <TableCol idRow={index} idCell={4} textAlign="text-center" border='border'>
                                    <PermissionsDetail permisos={rol.permisos} />
                                    {/* {rol.permisos.length > 0 
                                        ?
                                                rol.permisos.map((permiso, idx) => {
                                                    let actions = permiso.acciones.split(',')
                                                    return (
                                                        <span id={'row'+idx+'-cell4-'+idx} className="bg-gray-100 text-gray-800 text-sm mr-2 md:mr-2 lg:mr-2 xl:mr-3 text-center mr-2 px-2.5 py-0.5 rounded">
                                                            {permiso.cmodulo_vista__nombre} : 
                                                            {
                                                                actions.map((action) => {
                                                                   return <span dangerouslySetInnerHTML={{__html: actionIcons[action]}} />
                                                                })
                                                            }
                                                        </span>
                                                    )
                                                })
                                        :
                                            "No se definieron permisos"
                                    } */}
                                    
                                </TableCol>
                            </tr>
                        );
                    })}
                </Table>
                </ColumnContainer>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                {/* <Pagination 
                    postsPerPage={postsPerPage} 
                    totalPosts={roles.length} 
                    paginate={paginate} 
                    currentPage={currentPage} 
                /> */}
            </div>
        </MainContainer>
    );
};

export default UsersDataTable;