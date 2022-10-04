 import React, { useEffect, useState } from 'react';

import useAuth from "../../hooks/useAuth";
import { get_users } from '../../api/users';

import { MainContainer } from "../../components/layout/Container";
import { Title } from "../../components/layout/Title";
import UsersDataTable from './UsersDataTable';
import Loading from '../../components/layout/Loading';

const Usuarios = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    // cargar todos los usuarios registrados
    useEffect(() => {
        const getUsers = async () => {
            const { data } = await get_users(auth);
            setUsers( () => data.listado_usuarios );
        }
        setLoading(true);
        getUsers();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Listar Usuarios registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <UsersDataTable users={users} setUsers={setUsers} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};

export default Usuarios;
