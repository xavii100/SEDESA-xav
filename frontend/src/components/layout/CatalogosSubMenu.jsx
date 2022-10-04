import React, { useEffect, useState, useRef } from "react";
import listenForOutsideClicks from "../../utils/listenForOutsideClicks";
import { Link } from "react-router-dom";

const CatalogosSubMenu = ({ activePage, handleMenuClick, listaCatalogos }) => {

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
		document.getElementById('catalogos-Dropdown').style.display = 'none';
		setIsOpen(false)
	}

	return (
		<>
		<div className={`dropdown block py-2 pr-4 pl-3 rounded md:bg-transparent ${activePage.catalogos} hover:bg-green-100 md:hover:bg-transparent md:hover:text-institute-green md:p-0`}  ref={menuRef}>
			<button
				className="dropbtn"
				onClick={() => {
					toggle(isOpen);
			}}
			>
			<i className="bi bi-inboxes"></i> Catálogos
			</button>
			{isOpen ? (
			<div
				id="catalogos-Dropdown"
				className="dropdown-content sm:right-0 lg:right-[0%] sm:top-0 lg:top-[150%] rounded-b-lg font-normal text-sm md:text-institute-gray text-institute-gray cursor-pointer"
			>
				{listaCatalogos.indexOf("c_antecedentes") !== -1 ? (
					<a key="option-1" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/antecedentes">
							<i class="bi bi-clock-history mx-2"></i> Antecedentes
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_constantes_vitales") !== -1 ? (
					<a key="option-2" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/constantesvitales">
							<i class="bi bi-activity mx-2"></i> Constantes vitales
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_especialidad") !== -1 ? (
					<a key="option-2" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/especialidades">
							<i class="bi bi-search-heart mx-2"></i> Especialidades
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_estado_alerta") !== -1 ? (
					<a key="option-4" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/estadosalerta">
							<i class="bi bi-exclamation-octagon mx-2"></i> Estados de alerta
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_hospital") !== -1 ? (
					<a key="option-5" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/hospitales">
							<i class="bi bi-hospital mx-2"></i> Hospitales
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_medicamento") !== -1 ? (
					<a key="option-7" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/medicamentos">
							<i class="bi bi-archive mx-2"></i> Medicamentos
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_motivo_alta") !== -1 ? (
					<a key="option-7" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/motivosalta">
							<i class="bi bi-person-check mx-2"></i> Motivos de alta
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_sintomas") !== -1 ? (
					<a key="option-6" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/sintomas">
							<i class="bi bi-bandaid mx-2"></i> Síntomas
						</Link>
					</a>
				) : (
					""
				)}

				{listaCatalogos.indexOf("c_vacuna") !== -1 ? (
					<a key="option-7" className="px-2 pb-2 pt-2 hover:bg-institute-green hover:text-white" onClick={ () => {handleClick(); handleMenuClick('catalogos')} }>
						<Link to="/sedesa/catalogos/vacunas">
							<i class="bi bi-eyedropper mx-2"></i> Vacunas
						</Link>
					</a>
				) : (
					""
				)}
			</div>
			) : (
			""
			)}
		</div>
		</>
	);
};
export default CatalogosSubMenu;
