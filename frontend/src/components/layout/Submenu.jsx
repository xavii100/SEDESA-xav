import React, { useEffect, useState, useRef } from "react";
import listenForOutsideClicks from "../../utils/listenForOutsideClicks";
import { Link } from "react-router-dom";

const SubMenu = ({ activePage, handleMenuClick, title, options, iconClassSubmenu }) => {

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
		document.getElementById(`${title}-dropdown`).style.display = 'none';
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
			<i className={iconClassSubmenu}></i> {title}
			</button>
			{isOpen ? (
			<div
				id={`${title}-dropdown`}
				className="dropdown-content sm:right-0 lg:right-[-20%] rounded-b-lg font-normal text-sm md:text-institute-gray text-institute-gray cursor-pointer"
			> { options.map((option) => {                          
				return (
                                        <>
                                                {option.newLine ? (<div className="w-full border-t border-1 border-line-color"></div>) :  ''}
                                                <span key="option-1" className="px-2 pb-2 pt-2" onClick={ () => {handleClick(); handleMenuClick(option.name)} }>
                                                        <Link to={`/sedesa/${option.path}`}>
                                                                <i className={option.class}></i> {option.name}
                                                        </Link>
                                                </span>
                                        </>
                                        )
                        }) }
			</div>
			) : (
			""
			)}
		</div>
		</>
	);
};
export default SubMenu;
