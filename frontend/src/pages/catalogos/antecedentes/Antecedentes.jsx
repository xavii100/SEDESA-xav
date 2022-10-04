import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_antecedentes} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import AntecedentesDataTable from './AntecedentesDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const Antecedentes = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [antecedentes, setAntecedentes] = useState([]);

    // cargar todos los antecedentes registrados
    useEffect(() => {
        const getAntecedentes = async () => {
            const { data } = await get_antecedentes(auth);
            setAntecedentes( () => data.antecedentes );
        }
        setLoading(true);
        getAntecedentes();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de antecedentes registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <AntecedentesDataTable antecedentes={antecedentes} setAntecedentes={setAntecedentes} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Antecedentes;