import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_vacunas} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import VacunasDataTable from './VacunasDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const Vacunas = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [vacunas, setVacunas] = useState([]);

    // cargar todos los vacunas registrados
    useEffect(() => {
        const getVacunas = async () => {
            const { data } = await get_vacunas(auth);
            setVacunas( () => data.vacunas );
        }
        setLoading(true);
        getVacunas();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de vacunas registradas"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <VacunasDataTable vacunas={vacunas} setVacunas={setVacunas} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Vacunas;