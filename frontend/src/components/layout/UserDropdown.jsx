import React, { useEffect, useState, useRef } from "react";
import listenForOutsideClicks from "../../utils/listenForOutsideClicks";
import { Link } from "react-router-dom";
import { UserPhoto } from "./UserPhoto";

const UserDropdown = ({
  idUsuario,
  rol,
  nombreUsuario,
  email,
  hospital,
  logout,
}) => {
  // Hide and show dropdown
  const [isOpen, setIsOpen] = useState(false);
  const toggle = (isOpen) => {
    return setIsOpen(!isOpen);
  };
  // Hide Dropdown on Outside Click
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);
  useEffect(
    listenForOutsideClicks(listening, setListening, menuRef, setIsOpen)
  );

  return (
    <>
      <div className="dropdown" ref={menuRef}>
        <button
          className="dropbtn"
          onClick={() => {
            toggle(isOpen);
          }}
        >
          <UserPhoto />
        </button>
        {isOpen ? (
          <div
            id="user-Dropdown"
            className="dropdown-content sm:right-0 lg:right-[-20%] rounded-b-lg font-normal text-sm md:text-institute-gray text-institute-gray cursor-pointer"
          >
            <span key="option-1" className="px-2 pb-1 pt-2" style={{cursor: 'default'}}>
              <i className="bi bi-briefcase"></i> {rol}
            </span>
            <span key="option-2" className="px-2 pb-1 pt-2" style={{cursor: 'default'}}>
              <i className="bi bi-person"></i> {nombreUsuario.split(' ').slice(0, 2).join(" ") }
            </span>
            {/* <span key="option-2" className="px-2 pb-1 pt-2" style={{cursor: 'default'}}>
              <i className="bi bi-envelope"></i> {email}
            </span> */}
            <span key="option-3" className="px-2 pb-1 pt-2" style={{cursor: 'default'}}>
              <i className="bi bi-hospital"></i> {hospital}
            </span>
            <div className="pt-2 pb-2">
              <div className="w-full border-t border-1 border-line-color"></div>
            </div>
            <Link
              to="/sedesa/etl/bitacora"
              state={{ userid: idUsuario }}
            >
              <span key="option-4" className="px-2 pb-1 pt-2">
                <i className="bi bi-list-ul"></i> Bitácora
              </span>
            </Link>
            <Link
              // to="/sedesa/usuarios/editar"
              to="/sedesa/usuarios/editarperfil"
              state={{ userid: idUsuario }}
            >
              <span key="option-5" className="px-2 pb-1 pt-2">
                <i className="bi bi-sliders"></i> Ajustes
              </span>
            </Link>
            <span key="option-6" className="px-2 pb-2 pt-2" onClick={logout}>
              <i className="bi bi-door-open"></i> Cerrar sesión
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default UserDropdown;
