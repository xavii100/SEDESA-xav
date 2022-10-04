import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_sintomas} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import SintomasDataTable from './SintomasDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const Sintomas = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sintomas, setSintomas] = useState([]);

    // cargar todos los síntomas registrados
    useEffect(() => {
        const getSintomas = async () => {
            const { data } = await get_sintomas(auth);
            setSintomas( () => data.sintomas );
        }
        setLoading(true);
        getSintomas();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de síntomas registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <SintomasDataTable sintomas={sintomas} setSintomas={setSintomas} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Sintomas;