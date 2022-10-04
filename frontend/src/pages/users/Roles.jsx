import React, { useContext, useEffect, useState } from 'react'

import useAuth from '../../hooks/useAuth'
import { get_roles } from '../../api/catalogues';

import { MainContainer, RowsContainer, ColumnContainer } from "./../../components/layout/Container";
import { Title } from "./../../components/layout/Title";

import RolesDataTable from './RolesDataTable';
import Loading from '../../components/layout/Loading';

const Roles = () => {
    const { auth } =  useAuth();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    // cargar todos los roles registrados
    useEffect(() => {
        const getRoles = async () => {
            const { data } = await get_roles(auth);
            const newRoles = data.roles.map((rol) => {
                if (rol.admin) return {...rol, ['admin']: 'a'}
                else if (!rol.admin) return {...rol, ['admin']: 'b'}
            });
            setRoles( () => newRoles);
        }
        setLoading(true);
        getRoles();
        setLoading(false);
    }, [])
    

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Listar Roles registrados"
                />
                <RowsContainer columns={1}>
                    <ColumnContainer>
                        { loading ? <Loading /> : <RolesDataTable roles={roles} setRoles={setRoles} /> }
                    </ColumnContainer>
                </RowsContainer>
            </MainContainer>
        </>
    );
};

export default Roles;
