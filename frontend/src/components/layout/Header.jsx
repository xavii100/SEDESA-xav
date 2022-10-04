import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import Logo from "./Logo";
import UserDropdown from "./UserDropdown";
import SubMenu from "./Submenu";
import CatalogosSubMenu from "./CatalogosSubMenu";

import {get_user} from "../../api/users";
import useAuth from "../../hooks/useAuth";

const Header = () => {
    const {auth, logoutUser} = useAuth();
    const [user, setUser] = useState([]);
    const [catalogo, setCatalogo] = useState([]);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const INIT = {
        inicio: "md:text-institute-gray text-institute-gray bg-white",
        triage: "md:text-institute-gray text-institute-gray bg-white",
        tableros: "md:text-institute-gray text-institute-gray bg-white",
        expedientes: "md:text-institute-gray text-institute-gray bg-white",
        usuarios: "md:text-institute-gray text-institute-gray bg-white",
        catalogos: "md:text-institute-gray text-institute-gray bg-white",
    };

    // cargar datos del usuario logeado
    useEffect(() => {
        const get_user_profile = async () => {
        const {data} = await get_user({token: auth.token, id_user: auth.id_user}, logoutUser);
        setUser(() => data.data);
        setCatalogo(() => Object.keys(data.data.permisos).filter(key => key.indexOf("c_") !== -1));
        };
        get_user_profile();
    }, []);

    const [activePage, setActivePage] = useState(INIT);

    function ChangeActivePage(id) {
        const ReseteoINIT = Object.assign({}, INIT);
        ReseteoINIT[id] = "md:text-institute-green border-b-4 border-institute-green text-white bg-green-500";
        setActivePage(ReseteoINIT);
    }

    useEffect(() => {
        let currentPage = window.location.pathname.split("/")[2];
        ChangeActivePage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = id => {
        ChangeActivePage(id);
        setIsNavOpen(false); // ocultar el navbar en modo mobile
    };

    const usuarios = [
        {name: "Visualizar Usuarios", class: "bi bi-table ml-2", path:"usuarios"}, 
        {name: "Nuevo Usuario", class: "bi bi-plus-circle ml-2", path:"usuarios/registro"}, 
        {name: "Visualizar Roles", class: "bi bi-table ml-2", path:"usuarios/roles", newLine:true},
        {name: "Nuevo Rol de Usuario", class: "bi bi-plus-circle ml-2", path:"usuarios/roles/registro"}
    ];

    const catalogos = [
        {name: "Antecedentes", class: "bi bi-clock-history mx-2", path:"catalogos/antecedentes"}, 
        {name: "Constantes vitales", class: "bi bi-activity mx-2", path:"catalogos/constantesvitales"}, 
        {name: "Especialidades", class: "bi bi-search-heart mx-2", path:"catalogos/especialidades"}, 
        {name: "Estados de alerta", class: "bi bi-exclamation-octagon mx-2", path:"catalogos/estadosalerta"}, 
        {name: "Hospitales", class: "bi bi-hospital mx-2", path:"catalogos/hospitales"}, 
        {name: "Medicamentos", class: "bi bi-archive mx-2", path:"catalogos/medicamentos"}, 
        {name: "Motivos de alta", class: "bi bi-person-check mx-2", path:"catalogos/motivosalta"}, 
        {name: "Síntomas", class: "bi bi-bandaid mx-2", path:"catalogos/sintomas"}, 
        {name: "Terapéuticas", class: "bi bi-box2-heart mx-2", path:"catalogos/terapeuticas"}, 
        {name: "Vacunas", class: "bi bi-eyedropper mx-2", path:"catalogos/vacunas"}, 
    ]

    return (
        <nav className="bg-white shadow-lg border-gray-200 px-2 sm:px-4 py-2.5 rounded">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <Link to="#" className="flex items-center">
                    <Logo />
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-500">
                    SIH-SEDESA
                    </span>
                </Link>
                <div className="flex items-center md:order-2">
                    <UserDropdown 
                        idUsuario={ user.usuario_id } 
                        rol={ user.rol }
                        nombreUsuario={ user.nombre_completo } 
                        // email={ user.email } 
                        hospital={ user.hospital_corto } 
                        logout={ logoutUser } 
                    />
                    <button
                        data-collapse-toggle="mobile-menu-2"
                        type="button"
                        className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        aria-controls="mobile-menu-2"
                        aria-expanded="false"
                        onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                            />
                        </svg>
                        <svg
                            className="hidden w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                {/* menus */}
                <div
                    className={`${isNavOpen ? '' : 'hidden'} justify-between items-center w-full md:flex md:w-auto md:order-1`}
                    id="mobile-menu-2"
                >
                    <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-base md:font-semibold">
                        <li key="li-inico">
                            <Link
                                id="inicio"
                                to="/sedesa/inicio"
                                className={`block py-2 pr-4 pl-3 rounded md:bg-transparent ${activePage.inicio} hover:bg-green-100 md:hover:bg-transparent md:hover:text-institute-green md:p-0`}
                                onClick={ (e) => handleClick(e.target.id) }
                            >
                            <i className="bi bi-house-door"></i> Inicio
                            </Link>
                        </li>
                        { user.permisos && (user.permisos.hasOwnProperty('triage') || user.admin)
                            ?
                            <li key="li-triage">
                                <Link
                                    id="triage"
                                    to="/sedesa/triage"
                                    className={`block py-2 pr-4 pl-3 rounded md:bg-transparent ${activePage.triage} hover:bg-green-100 md:hover:bg-transparent md:hover:text-institute-green md:p-0`}
                                    onClick={ (e) => handleClick(e.target.id) }
                                >
                                <i className="bi bi-journal-text"></i> Triage
                                </Link>
                            </li>
                            : ""
                        }
                        { 
                        user.permisos && (user.permisos.hasOwnProperty('tablero') || user.admin)
                            ?
                            <li key="li-tableros">
                                <Link
                                    id="tableros"
                                    to="/sedesa/reporte_diario"
                                    className={`block py-2 pr-4 pl-3 rounded md:bg-transparent ${activePage.tableros} hover:bg-green-100 md:hover:bg-transparent md:hover:text-institute-green md:p-0`}
                                    onClick={ (e) => handleClick(e.target.id) }
                                >
                                <i className="bi bi-bar-chart-line"></i> Tableros
                                </Link>
                            </li>
                        : ""
                        }
                        { user.permisos && (user.permisos.hasOwnProperty('expediente') || user.admin)
                            ?
                            <li key="li-expedientes">
                                <Link
                                    id="expedientes"
                                    to="/sedesa/expedientes"
                                    className={`block py-2 pr-4 pl-3 rounded md:bg-transparent ${activePage.expedientes} hover:bg-green-100 md:hover:bg-transparent md:hover:text-institute-green md:p-0`}
                                    onClick={ (e) => handleClick(e.target.id) }
                                >
                                <i className="bi bi-journals"></i> Expedientes
                                </Link>
                            </li>
                            : ""
                        }
                        { 
                        user.permisos && (user.permisos.hasOwnProperty('usuarios') || user.admin)
                            ?
                            <li key="li-usuarios">
                                <SubMenu id="usuarios" activePage={activePage} handleMenuClick={ handleClick } title="Usuario" options={usuarios} iconClassSubmenu="bi bi-people" />
                            </li>
                            : ""
                        }
                        {user.permisos && (catalogo.length > 0 || user.admin) 
                            ? 
                            <li key="li-catalogos">
                                <SubMenu id="catalogos" activePage={activePage} handleMenuClick={ handleClick } title="Catálogos" options={catalogos} iconClassSubmenu="bi bi-inboxes"/>
                            </li>
                            : ""
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
