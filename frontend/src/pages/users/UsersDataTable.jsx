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
const NEW_USER_URL = '/sedesa/usuarios/registro'
const EDIT_USER_URL = 'editar' // ruta absoluta: /sedesa/usuarios/actualizacion

const UsersDataTable = ( { users, setUsers }) => {
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [sortTerm, setSortTerm] = useState('');

    // -----------------------------------------------------------------------------------------------------------------------
    // remover Usuarios
    const handleRemoveUser = (user_ad) => {
        Swal.fire({
            title: "Eliminar Usuario",
            text: '¿Estás seguro que deseas eliminar a "'+user_ad['name']+'"? ¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then( (result) => {
            if (result.isConfirmed) { // hicieron click en "Sí"
                const userDeleteManagement = async () => {
                    const { data } = await delete_user(auth, {id_usuario: user_ad['user_id']} );
                    Swal.fire(data.success, '', 'success')
                    const newUsers = users.filter((user) => user.tusuario_id !== user_ad['user_id']);
                    setUsers(newUsers);
                }
                userDeleteManagement();
            }
        });
    };
    
    // -----------------------------------------------------------------------------------------------------------------------
    // activar/desactivar usuario
    const handleActivateDesactivateUser = (user_ad) => {
        let title = user_ad['active'] ? "Desactivar" : "Activar"
        let text = user_ad['active'] ? "desactivar" : "activar"
        Swal.fire({
            title: title+" Usuario",
            text: '¿Está seguro que desea '+text+' a '+user_ad['name']+'?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, '+text,
            cancelButtonText: "Cancelar",
        }).then( (result) => {
            if (result.isConfirmed) { // hicieron click en "Sí"
                const userActivateManagement = async () => {
                    const { data } = await activate_user(auth, {id_usuario: user_ad['user_id'], activar: user_ad['active'] ? 0 : 1})
                    Swal.fire(data.success, '', 'success');
                    const newUsers = users.filter((user) => {
                        if (user.tusuario_id === user_ad['user_id']) {
                            user.is_active = user_ad['active'] ? false : true
                            return (user);
                        } else return (user);
                    });
                    setUsers(newUsers);
                }
                userActivateManagement();
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
        users.sort((a, b) => {
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
        { id: 'acciones', text: 'Acciones', className: 'text-center' },
        { id: 'email', text: 'Email', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'nombre_usuario', text: 'Nombre Usuario', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'nombre_hospital', text: 'Hospital', className: 'cursor-pointer', onClick: (e) => getOptionsToSort(e) },
        { id: 'rol', text: 'Rol Usuario', className: 'text-center cursor-pointer', onClick: (e) => getOptionsToSort(e) },
    ]

    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <ColumnContainer>
                    <Link to={NEW_USER_URL}>
                        <LightButton text='Registrar nuevo Usuario'>
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
                        <OptionSelectForm key="10_reg" id="10_reg" value="10">10 registros</OptionSelectForm>
                        <OptionSelectForm key="25_reg" id="25_reg" value="25">25 registros</OptionSelectForm>
                        <OptionSelectForm key="50_reg" id="50_reg" value="50">50 registros</OptionSelectForm>
                        <OptionSelectForm key="100_reg" id="100_reg" value="100">100 registros</OptionSelectForm>
                    </SelectContentForm>
                </ColumnContainer>
            </div>
            <RowsContainer columns={1}>
                <Table head={tableHead}>
                    {users.slice(
                            (currentPage * postsPerPage) - postsPerPage, currentPage * postsPerPage
                    ).filter((user) => {
                        if (searchTerm.trim() === "") return (user);
                        else if (
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.nombre_hospital.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.rol.toLowerCase().includes(searchTerm.toLowerCase())
                        ) return (user)
                    }).map((user, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCol key={index+'1'} border='border-r' textAlign="text-center">
                                    <div className='inline-flex'>
                                        { auth.id_user === user.tusuario_id
                                            ?
                                            <span className="flex md:text-base lg:text-xl mr-2 md:mr-2 lg:mr-2 xl:mr-3 cursor-not-allowed font-bold text-center text-gray-300" title='No se puede desactivar este usuario'>
                                                { user.is_active ? <i class="bi bi-person-check-fill"></i> : <i class="text-amber-400 bi bi-person-x-fill"></i> }
                                            </span>
                                            :
                                            <span className="flex md:text-base lg:text-xl mr-2 md:mr-2 lg:mr-2 xl:mr-3 cursor-pointer font-bold text-center text-gray-500" title={user.is_active ? 'Desactivar Usuario' : 'Activar Usuario'}  onClick={ () => handleActivateDesactivateUser({ user_id: user.tusuario_id, active: user.is_active, name:user.nombre_usuario }) }>
                                                { user.is_active ? <i class="bi bi-person-check-fill"></i> : <i class="text-amber-400 bi bi-person-x-fill"></i> }
                                            </span>
                                        }
                                        <Link to={EDIT_USER_URL} state={{userid:user.tusuario_id}}>
                                            <span className="flex md:text-base lg:text-xl mr-2 md:mr-2 lg:mr-2 xl:mr-3 cursor-pointer font-bold text-center text-gray-500" title="Editar Usuario">
                                                <i class="bi bi-pencil-square font-bold"></i>
                                            </span>
                                        </Link>
                                        { auth.id_user === user.tusuario_id 
                                            ?
                                            <span className="flex md:text-base lg:text-xl cursor-not-allowed font-bold text-center text-gray-300" title="No se puede eliminar este usuario">
                                                <i class="bi bi-trash"></i>
                                            </span>
                                            :
                                            <span className="flex md:text-base lg:text-xl cursor-pointer font-bold text-center text-gray-500" title="Eliminar Usuario" onClick={ () => handleRemoveUser({ user_id: user.tusuario_id, name:user.nombre_usuario }) }>
                                                <i class="bi bi-trash"></i>
                                            </span>
                                        }
                                    </div>
                                </TableCol>
                                <TableCol key={index+'2'} textAlign="text-center" border='border-r'>{user.email}</TableCol>
                                <TableCol key={index+'3'} border='border-r'>{user.nombre_usuario}</TableCol>
                                <TableCol key={index+'4'} border='border-r'>{user.nombre_hospital}</TableCol>
                                <TableCol key={index+'5'} textAlign="text-center">{user.rol}</TableCol>
                            </TableRow>
                        );
                    })}
                </Table>
            </RowsContainer>
            <RowsContainer columns={1}>
                <Pagination 
                    postsPerPage={postsPerPage} 
                    totalPosts={users.length} 
                    paginate={paginate} 
                    currentPage={currentPage} 
                />
            </RowsContainer>
        </>
    );
};

export default UsersDataTable;