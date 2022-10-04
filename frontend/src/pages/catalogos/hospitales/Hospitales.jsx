import React, {useEffect, useState} from 'react'
// import axios from "axios";

import useAuth from "../../../hooks/useAuth";
import {get_hospitales} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import HospitalesDataTable from './HospitalesDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../../css/index.css'

const Hospitales = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [hospitales, setHospitales] = useState([]);

    // cargar todos los hospitales registrados
    useEffect(() => {
        const getHospitales = async () => {
            const { data } = await get_hospitales(auth);
            setHospitales( () => data.hospitales );
        }
        setLoading(true);
        getHospitales();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de hospitales registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <HospitalesDataTable hospitales={hospitales} setHospitales={setHospitales} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Hospitales;