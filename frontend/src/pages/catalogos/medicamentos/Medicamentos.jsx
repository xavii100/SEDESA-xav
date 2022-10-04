import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_medicamentos} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import MedicamentosDataTable from './MedicamentosDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const Medicamentos = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [medicamentos, setMedicamentos] = useState([]);

    // cargar todos los medicamentos registrados
    useEffect(() => {
        const getMedicamentos = async () => {
            const { data } = await get_medicamentos(auth);
            setMedicamentos( () => data.medicamentos );
        }
        setLoading(true);
        getMedicamentos();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de medicamentos registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <MedicamentosDataTable medicamentos={medicamentos} setMedicamentos={setMedicamentos} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Medicamentos;