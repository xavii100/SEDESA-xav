import React, { useEffect, useState, useRef } from "react";
import listenForOutsideClicks from "../../utils/listenForOutsideClicks";
import { Link } from "react-router-dom";

const UserSubMenu = ({ activePage, handleMenuClick }) => {

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

	function handleClick(){
		document.getElementById('user-Dropdown').style.display = 'none';
		setIsOpen(false)
	}

	return (
		<>
		<div className={`dropdown block py-2 pr-4 pl-3 rounded md:bg-transparent ${activePage.usuarios} hover:bg-green-100 md:hover:bg-transparent md:hover:text-institute-green md:p-0`}  ref={menuRef}>
			<button
				className="dropbtn"
				onClick={() => {
					toggle(isOpen);
			}}
			>
			<i className="bi bi-people"></i> Usuarios
			</button>
			{isOpen ? (
			<div
				id="user-Dropdown"
				className="dropdown-content sm:right-0 lg:right-[-20%] rounded-b-lg font-normal text-sm md:text-institute-gray text-institute-gray cursor-pointer"
			>
				<span key="option-1" className="px-2 pb-2 pt-2" onClick={ () => {handleClick(); handleMenuClick('usuarios')} }>
					<Link to="/sedesa/usuarios">
						<i className="bi bi-table ml-2"></i> Visualizar Usuarios
					</Link>
				</span>
				<span key="option-2" className="px-2 pb-2 pt-2" onClick={ () => {handleClick(); handleMenuClick('usuarios')} }>
					<Link to="/sedesa/usuarios/registro">
						<i className="bi bi-plus-circle ml-2"></i> Nuevo Usuario
					</Link>
				</span>
				<div className="pt-2 pb-2">
					<div className="w-full border-t border-1 border-line-color"></div>
				</div>
				<span key="option-3" className="px-2 pb-2 pt-2" onClick={ () => {handleClick(); handleMenuClick('usuarios')} }>
					<Link to="/sedesa/usuarios/roles">
						<i className="bi bi-table ml-2"></i> Visualizar Roles
					</Link>
				</span>
				<span key="option-4" className="px-2 pb-2 pt-2" onClick={ () => {handleClick(); handleMenuClick('usuarios')} }>
					<Link to="/sedesa/usuarios/roles/registro">
						<i className="bi bi-plus-circle ml-2"></i> Nuevo Rol de Usuario
					</Link>
				</span>
			</div>
			) : (
			""
			)}
		</div>
		</>
	);
};
export default UserSubMenu;
