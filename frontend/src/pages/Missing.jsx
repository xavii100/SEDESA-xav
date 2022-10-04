import { Navigate } from 'react-router-dom';
import { CenteredContainer } from '../components/layout/Container';

const HOME_URL = '/sedesa/inicio'

const Missing = () => {
    // redireccionar a la página de Inicio.
    // en caso de no estar logeado será redireccionado al login
    return (
        <CenteredContainer>
            <div>
                Página no encontrada!
                <Navigate to={HOME_URL} />;
            </div>
        </CenteredContainer>
    );
};

export default Missing;