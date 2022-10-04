import {Routes, Route} from "react-router-dom";

import LayoutPublic from "./components/layout/LayoutPublic";
import LayoutPrivate from "./components/layout/LayoutPrivate";
import RequireAuth from "./components/layout/RequireAuth";

import Inicio from "./pages/Inicio";
import Autenticacion from "./pages/users/Autenticacion";

// usuarios
import Registro from "./pages/users/Registro";
import EditarUsuario from "./pages/users/EditarUsuario";
import EditarPerfilUsuario from "./pages/users/EditarPerfilUsuario";
import Roles from "./pages/users/Roles";
import RegistroRol from "./pages/users/RegistroRol";
import EditarRol from "./pages/users/EditarRol";
import Usuarios from "./pages/users/Usuarios";

// triage
import Triage from "./pages/triage/Triage";
import TriagePacientes from "./pages/triage/Pacientes";

// missing
import Missing from "./pages/Missing";

// expedientes
import Expedientes from "./pages/expedientes/Expedientes";
import Bitacoras from "./pages/etl/Bitacoras";

//Tableros
import Tableros from "./pages/tableros/Tableros";
import ReporteDiario from "./pages/tableros/ReporteDiario";

// Catalogos
import Hospitales from "./pages/catalogos/hospitales/Hospitales";
import HospitalesRegistro from "./pages/catalogos/hospitales/HospitalesRegistro";
import HospitalesActualizacion from "./pages/catalogos/hospitales/HospitalesActualizacion";

import ConstantesVitales from "./pages/catalogos/constantesVitales/ConstantesVitales";
import ConstantesVitalesRegistro from "./pages/catalogos/constantesVitales/ConstantesVitalesRegistro";
import ConstantesVitalesActualizacion from "./pages/catalogos/constantesVitales/ConstantesVitalesActualizacion";

import Sintomas from "./pages/catalogos/sintomas/Sintomas";
import SintomasRegistro from "./pages/catalogos/sintomas/SintomasRegistro";
import SintomasActualizacion from "./pages/catalogos/sintomas/SintomasActualizacion";

import Antecedentes from "./pages/catalogos/antecedentes/Antecedentes";
import AntecedentesRegistro from "./pages/catalogos/antecedentes/AntecedentesRegistro";
import AntecedentesActualizacion from "./pages/catalogos/antecedentes/AntecedentesActualizacion";

import Especialidades from "./pages/catalogos/especialidades/Especialidades";
import EspecialidadesRegistro from "./pages/catalogos/especialidades/EspecialidadesRegistro";
import EspecialidadesActualizacion from "./pages/catalogos/especialidades/EspecialidadesActualizacion";

import EstadosAlerta from "./pages/catalogos/estadosAlerta/EstadosAlerta";
import EstadosAlertaRegistro from "./pages/catalogos/estadosAlerta/EstadosAlertaRegistro";
import EstadosAlertaActualizacion from "./pages/catalogos/estadosAlerta/EstadosAlertaActualizacion";

import Vacunas from "./pages/catalogos/vacunas/Vacunas";
import VacunasRegistro from "./pages/catalogos/vacunas/VacunasRegistro";
import VacunasActualizacion from "./pages/catalogos/vacunas/VacunasActualizacion";

import Medicamentos from "./pages/catalogos/medicamentos/Medicamentos";
import MedicamentosRegistro from "./pages/catalogos/medicamentos/MedicamentosRegistro";
import MedicamentosActualizacion from "./pages/catalogos/medicamentos/MedicamentosActualizacion";

import MotivosAlta from "./pages/catalogos/motivosAlta/MotivosAlta";
import MotivosAltaRegistro from "./pages/catalogos/motivosAlta/MotivosAltaRegistro";
import MotivosAltaActualizacion from "./pages/catalogos/motivosAlta/MotivosAltaActualizacion";

import Terapeuticas from "./pages/catalogos/terapeuticas/Terapeuticas";
import TerapeuticasRegistro from "./pages/catalogos/terapeuticas/TerapeuticasRegistro";
import TerapeuticasActualizacion from "./pages/catalogos/terapeuticas/TerapeuticasActualizacion";

import useAuth from "./hooks/useAuth";
import jwtDecode from "jwt-decode";


function App() {
  const {auth} = useAuth();
  const urls = auth !== null && auth.token !== null ? Object.keys(jwtDecode(auth.token).permisos) : [];
  const sudo = auth !== null && auth.token !== null ? jwtDecode(auth.token).admin : false;
  const id_user = auth !== null && auth.token !== null ? auth.id_user : 0;

  return (
    <Routes>
      <Route path="/" element={<LayoutPublic />}>
        {/* rutas públicas */}
        <Route path="/sedesa/autenticacion" element={<Autenticacion />} />

        {/* rutas protegidas */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<LayoutPrivate />}>
            {/* ruta de home (inicio), accesible a todos los usuarios */}
            <Route path="/sedesa/inicio" element={<Inicio />} />

            {/* ruta para accesar a la página de triage */}
            {urls.indexOf("triage") !== -1 || sudo ? <Route path="/sedesa/triage" element={<Triage />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {/* ruta para accesar al listado de pacientes de triage */}
            {urls.indexOf("pacientes") !== -1 || sudo ? <Route path="/sedesa/pacientes" element={<TriagePacientes />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}


            {/* ruta para accesar a la página de expedientes */}
            {urls.indexOf("expediente") !== -1 || sudo ? <Route path="/sedesa/expedientes" element={<Expedientes />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* ruta para accesar a la página de bitácora del ETL */}
            {sudo ? <Route path="/sedesa/etl/bitacora" element={<Bitacoras />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* Catálogos */}
            {/* rutas para accesar a las páginas de hospitales */}
            {urls.indexOf("c_hospital") !== -1 || sudo ? <Route path="/sedesa/catalogos/hospitales" element={<Hospitales />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_hospital") !== -1 || sudo ? <Route path="/sedesa/catalogos/hospitales/registro" element={<HospitalesRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_hospital") !== -1 || sudo ? <Route path="/sedesa/catalogos/hospitales/actualizacion" element={<HospitalesActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de constantes vitales */}
            {urls.indexOf("c_constantes_vitales") !== -1 || sudo ? <Route path="/sedesa/catalogos/constantesvitales" element={<ConstantesVitales />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_constantes_vitales") !== -1 || sudo ? <Route path="/sedesa/catalogos/constantesvitales/registro" element={<ConstantesVitalesRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_constantes_vitales") !== -1 || sudo ? <Route path="/sedesa/catalogos/constantesvitales/actualizacion" element={<ConstantesVitalesActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de síntomas */}
            {urls.indexOf("c_sintomas") !== -1 || sudo ? <Route path="/sedesa/catalogos/sintomas" element={<Sintomas />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_sintomas") !== -1 || sudo ? <Route path="/sedesa/catalogos/sintomas/registro" element={<SintomasRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_sintomas") !== -1 || sudo ? <Route path="/sedesa/catalogos/sintomas/actualizacion" element={<SintomasActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de antecedentes */}
            {urls.indexOf("c_antecedentes") !== -1 || sudo ? <Route path="/sedesa/catalogos/antecedentes" element={<Antecedentes />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_antecedentes") !== -1 || sudo ? <Route path="/sedesa/catalogos/antecedentes/registro" element={<AntecedentesRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_antecedentes") !== -1 || sudo ? <Route path="/sedesa/catalogos/antecedentes/actualizacion" element={<AntecedentesActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de especialidades */}
            {urls.indexOf("c_especialidad") !== -1 || sudo ? <Route path="/sedesa/catalogos/especialidades" element={<Especialidades />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_especialidad") !== -1 || sudo ? <Route path="/sedesa/catalogos/especialidades/registro" element={<EspecialidadesRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_especialidad") !== -1 || sudo ? <Route path="/sedesa/catalogos/especialidades/actualizacion" element={<EspecialidadesActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de estados de alerta */}
            {urls.indexOf("c_estado_alerta") !== -1 || sudo ? <Route path="/sedesa/catalogos/estadosalerta" element={<EstadosAlerta />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_estado_alerta") !== -1 || sudo ? <Route path="/sedesa/catalogos/estadosalerta/registro" element={<EstadosAlertaRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_estado_alerta") !== -1 || sudo ? <Route path="/sedesa/catalogos/estadosalerta/actualizacion" element={<EstadosAlertaActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de vacunas */}
            {urls.indexOf("c_vacuna") !== -1 || sudo ? <Route path="/sedesa/catalogos/vacunas" element={<Vacunas />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_vacuna") !== -1 || sudo ? <Route path="/sedesa/catalogos/vacunas/registro" element={<VacunasRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_vacuna") !== -1 || sudo ? <Route path="/sedesa/catalogos/vacunas/actualizacion" element={<VacunasActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de medicamentos */}
            {urls.indexOf("c_medicamento") !== -1 || sudo ? <Route path="/sedesa/catalogos/medicamentos" element={<Medicamentos />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_medicamento") !== -1 || sudo ? <Route path="/sedesa/catalogos/medicamentos/registro" element={<MedicamentosRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_medicamento") !== -1 || sudo ? <Route path="/sedesa/catalogos/medicamentos/actualizacion" element={<MedicamentosActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de motivos de alta */}
            {urls.indexOf("c_motivo_alta") !== -1 || sudo ? <Route path="/sedesa/catalogos/motivosalta" element={<MotivosAlta />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_motivo_alta") !== -1 || sudo ? <Route path="/sedesa/catalogos/motivosalta/registro" element={<MotivosAltaRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_motivo_alta") !== -1 || sudo ? <Route path="/sedesa/catalogos/motivosalta/actualizacion" element={<MotivosAltaActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de terapeuticas */}
            {urls.indexOf("c_terapeutica") !== -1 || sudo ? <Route path="/sedesa/catalogos/terapeuticas" element={<Terapeuticas />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_terapeutica") !== -1 || sudo ? <Route path="/sedesa/catalogos/terapeuticas/registro" element={<TerapeuticasRegistro />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}
            {urls.indexOf("c_terapeutica") !== -1 || sudo ? <Route path="/sedesa/catalogos/terapeuticas/actualizacion" element={<TerapeuticasActualizacion />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a la página de edición de info del usuario logeado */}
            {/* {id_user > 0 ? <Route path="/sedesa/usuarios/editar" element={<EditarUsuario />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />} */}
            {id_user > 0 ? <Route path="/sedesa/usuarios/editarperfil" element={<EditarPerfilUsuario />} /> : <Route path="/sedesa/inicio" element={<Inicio />} />}

            {/* rutas para accesar a las páginas de usuarios, solo permitido para el Administrador */}
            {sudo ? (
              <>
                <Route path="/sedesa/usuarios" element={<Usuarios />} />
                <Route path="/sedesa/usuarios/registro" element={<Registro />} />
                <Route path="/sedesa/usuarios/editar" element={<EditarUsuario />} />
                <Route path="/sedesa/usuarios/roles" element={<Roles />} />
                <Route path="/sedesa/usuarios/roles/registro" element={<RegistroRol />} />
                <Route path="/sedesa/usuarios/roles/editar" element={<EditarRol />} />
                <Route path="/sedesa/tableros" element={<Tableros />} />
                <Route path="/sedesa/reporte_diario" element={<ReporteDiario />} />
              </>
            ) : (
              <Route path="/sedesa/inicio" element={<Inicio />} />
            )}
          </Route>
        </Route>

        {/* para todas las demás rutas redireccionan al inicio o login */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}
export default App;
