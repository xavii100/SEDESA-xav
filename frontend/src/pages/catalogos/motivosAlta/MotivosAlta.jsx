import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_motivosAlta} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import MotivosAltaDataTable from './MotivosAltaDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const MotivosAlta = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [motivosAlta, setMotivosAlta] = useState([]);

    // cargar todos los motivos de alta registrados
    useEffect(() => {
        const getMotivosAlta = async () => {
            const { data } = await get_motivosAlta(auth);
            // console.log(data);
            setMotivosAlta( () => data.motivos_alta );
        }
        setLoading(true);
        getMotivosAlta();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de motivos de alta registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <MotivosAltaDataTable motivosAlta={motivosAlta} setMotivosAlta={setMotivosAlta} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default MotivosAlta;