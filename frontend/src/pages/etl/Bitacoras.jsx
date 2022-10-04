import React, {useEffect, useState} from 'react'
// import axios from "axios";

import useAuth from "../../hooks/useAuth";
import {get_bitacora} from '../../api/etl';

import { MainContainer } from "../../components/layout/Container";
import { Title } from "../../components/layout/Title";
import BitacorasDataTable from './BitacorasDataTable';
import Loading from '../../components/layout/Loading';

// import '../../css/index.css'

const Bitacoras = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [bitacora, setBitacora] = useState([]);

    // cargar todas las bitácoras registradas
    useEffect(() => {
        const getBitacoras = async () => {
            const { data } = await get_bitacora(auth);
            setBitacora( () => data.bitacora );
        }
        setLoading(true);
        getBitacoras();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Bitácora de carga de datos"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <BitacorasDataTable bitacora={bitacora} setBitacora={setBitacora} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Bitacoras;