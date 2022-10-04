import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_especialidades} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import EspecialidadesDataTable from './EspecialidadesDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const Especialidades = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [especialidades, setEspecialidades] = useState([]);

    // cargar todas las especialidades registrados
    useEffect(() => {
        const getEspecialidades = async () => {
            const { data } = await get_especialidades(auth);
            setEspecialidades( () => data.especialidades );
        }
        setLoading(true);
        getEspecialidades();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de especialidades registradas"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <EspecialidadesDataTable especialidades={especialidades} setEspecialidades={setEspecialidades} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Especialidades;