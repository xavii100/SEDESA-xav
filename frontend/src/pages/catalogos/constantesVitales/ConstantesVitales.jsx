import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_constantesvitales} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import ConstantesVitalesDataTable from './ConstantesVitalesDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const ConstantesVitales = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [constantesVitales, setConstantesVitales] = useState([]);

    // cargar todas las constantes vitales registradas
    useEffect(() => {
        const getConstantesVitales = async () => {
            const { data } = await get_constantesvitales(auth);
            setConstantesVitales( () => data.constantes_vitales );
        }
        setLoading(true);
        getConstantesVitales();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de constantes vitales registradas"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <ConstantesVitalesDataTable constantesVitales={constantesVitales} setConstantesVitales={setConstantesVitales} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default ConstantesVitales;