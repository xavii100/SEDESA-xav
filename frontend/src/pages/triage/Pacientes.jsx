import React, { useEffect, useState } from 'react';

import useAuth from "../../hooks/useAuth";
import { get_pacientes } from '../../api/pacientes';

import { MainContainer } from "../../components/layout/Container";
import { Title } from "../../components/layout/Title";
import PacientesDataTable from './PacientesDataTable';
import Loading from '../../components/layout/Loading';
import { InputForm } from "../../components/layout/Form";
import { Table } from "./../../components/layout/Table";

const Pacientes = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pacientes, setPacientes] = useState([]);

    // cargar todos los usuarios registrados
    useEffect(() => {
        const getPacientes = async () => {
            const { data } = await get_pacientes(auth);
            setPacientes(() => data.data);
            //console.log(JSON.stringify(pacientes));
        }
        setLoading(true);
        getPacientes();
        setLoading(false);
    }, []);
    //var arr=pacientes.data;
    //const listItems = pacientes.map((d) => <li key={d.nombre}>{d.nombre}</li>);
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de Pacientes Registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        {/*Pacientes...
                        <p>{JSON.stringify(pacientes.data)}</p>
                        <div>
                            {listItems}
                        </div>*/}
                        {/*{ loading ? <Loading /> : <UsersDataTable users={users} setUsers={setUsers} /> }*/}
                    { loading ? <Loading /> : <PacientesDataTable pacientes={pacientes} setPacientes={setPacientes} /> }
                    </div>
                </div>
            </MainContainer>
        </>
    );
};

export default Pacientes;
