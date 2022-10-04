import React, { useRef, useState, useEffect, useReducer } from 'react'
import Swal from 'sweetalert2'

import { MainContainer } from "./../../components/layout/Container";
import { Title } from "./../../components/layout/Title";
import { Form, ValidateInputForm, LabelForm, InputForm, ToggleSwitchForm, SubmitButtonForm } from '../../components/layout/Form';
import { get_permissions } from '../../api/catalogues';

import useAuth from '../../hooks/useAuth';
import { insert_user_role } from '../../api/users';


const RegistroRol = () => {
    const { auth } = useAuth();
    const rolName = useRef();
    const [role, setRole] = useState(''); // obtener el nombre del rol
    const [err, setErr] = useState(''); // mensaje de error
    const [color, setColor] = useState(''); 
    // ---------------------------------------------------------------------------
    const [admin, setAdmin] = useState(false)
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [idList, setIdList] = useState([])
    const [permission, setPermission] = useState();
    const [acciones, setAcciones] = useState([]);
    const [textAdmin, setTextAdmin] = useState('No');
    const [countPermissions, setCountPermissions] = useState(0);
    // ---------------------------------------------------------------------------
    const [dbPermisos, setDbPermisos] = useState([]);

    // obtener todos los permisos registrados
    useEffect(() => {
        const getPermissions = async () => {
            const { data } = await get_permissions(auth);
            setDbPermisos( () => data.permisos);

            // total de permisos disponibles (total de acciones)
            data.permisos.map((per) => {
                setCountPermissions((prev) => prev + per.acciones.length )
            });

            // obtener la lista de columnas
            setAcciones(data.columnas)

            // crear la lista de ids de cada toggle
            let ids = data.permisos.map((per) => {
                return (per.acciones.map((a, i) =>  per.url+i))
            })
            setIdList( [].concat(...ids) );

            // crear diccionario de todas las url, son usados como nombres de los permisos
            const x = {}
            data.permisos.map((per) => x[per.url] = [] )
            setPermission(x);
        }
        getPermissions();
    }, [])

    const handleRoleNameChange = (e) => {
        const { value } = e.target
        setRole(value)
        if (value.trim() !== "") {
            setErr('')
            setColor('green')
        } else {
            setErr('Escribe un nombre de rol de usuario válido!')
            setColor('red')
        }  
    }

    // se marcan o desmarcan todos los toggles y se obtienen o descartan los valores
    const handleAdminChange = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(idList);
        if (isCheckAll) { // el rol NO es de tipo administrador
            setIsCheck([]);
            setTextAdmin('No');
            dbPermisos.map((rol) => {
                setPermission((prev) => ({
                    ...prev,
                    [rol.url] : [] // eliminar todas las acciones
                }));
            })
            setAdmin(false);
        } else { // el rol es de tipo administrador
            setTextAdmin('Si');
            setAdmin(true);
            dbPermisos.map((rol) => {
                setPermission((prev) => ({
                    ...prev,
                    [rol.url] : rol.acciones // agregar todas las acciones disponibles
                }));
            })
        }
    };

    function handleOnChange (e) {
        const { id, name, value, checked } = e.target;

        // colocar el valor de checked o unchecked en los toggles)
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
        
        // Caso 1 : el usuario hace check
        if (checked) {
            setPermission((prev) => ({
                ...prev,
                [name] : [...prev[name], value],
            }))
        }
        // Caso 2  : el usuario quita el check
        else {
            setPermission((prev) => ({
                ...prev,
                [name] : prev[name].filter((e) => e !== value)
            }))
        }
        
    };

    // enviar la información del formulario para registrar rol de usuario
    const handleRolUserSubmit = (e) => {
        e.preventDefault()
        const permisos = []
        Object.keys(permission).forEach((key) => {
            if (permission[key].length > 0) {
                permisos.push({
                    cmodulo_vista_id: dbPermisos.filter((per) => per.url === key)[0].cmodulo_vista_id,
                    acciones: permission[key],
                })
            }
        });
        const data_rol = {
            token: auth.token,
            rol: e.target.rol.value,
            permisos: permisos,
            sudo: admin ? 1 : 0,
        }
        if (e.target.rol.value.trim() !== "") {
            // registrar nuevo rol de usuario
            // console.log("datos a registrar:", data_rol)
            setErr('')
            setColor('')
            const insertUserRole = async () => {
                const result = await insert_user_role(auth, data_rol);
                if (result.status === 200) {
                    document.getElementById("frmSetUserRole").reset();
                    setIsCheck([]);
                    setTextAdmin('No');
                    setRole('');
                    setAdmin(false);
                    setIsCheckAll(false);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: result.data.success,
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    setErr(result.data.error);
                    setColor('red');
                }
            }
            insertUserRole();
        } else {
            setErr('Escribe un nombre de rol de usuario válido!');
            setColor('red');
        }
    }

    // cuando se seleccionan todos los valores (toggles) el rol es de tipo administrador, 
    // y el rol deja de ser administrador cuando se elimina al menos un valor (toggle)
    useEffect(() => {
        if (isCheck.length > 0 && isCheck.length === countPermissions) {
            setIsCheckAll(true); // activar toggle Tipo administrador
            setTextAdmin('Si');
            setAdmin(true);
        } else if (isCheck.length !== countPermissions) {
            setIsCheckAll(false); // desactivar toggle Tipo administrador
            setTextAdmin('No');
            setAdmin(false);
        }
    }, [isCheck]);

    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Registro de Rol de Usuario"
                />
                <Form id="frmSetUserRole" onSubmit={handleRolUserSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                        <div>
                            <ValidateInputForm 
                                id="rol"
                                innerRef={ rolName }
                                label="Rol de Usuario"
                                type="text" 
                                name="rol" 
                                value={ role }
                                placeholder="Escribe el Rol de Usuario" 
                                required={ true } 
                                autofocus={ true }
                                helpMessage={ err }
                                color={ color }
                                onChange={ handleRoleNameChange }
                            />
                            {/* <LabelForm htmlFor="rol" label="Rol de Usuario" />
                            <InputForm 
                                type="text" 
                                id="rol" 
                                name="rol" 
                                placeholder="Escribe el Rol de Usuario" 
                                required={true} 
                                autofocus="True"
                            /> */}

                            <LabelForm htmlFor="admin" label="Rol de Tipo Administrador" />
                            <ToggleSwitchForm 
                                id="admin"
                                name="admin"
                                text={textAdmin}
                                value="admin"
                                isChecked={ isCheckAll }
                                onChange={ handleAdminChange }
                            />
                        </div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                        <div>
                            <div className="relative mt-2 overflow-x-auto border shadow-sm sm:rounded-lg">
                                <table className="w-full table-auto text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-4" >Gestiones</th>
                                            <th scope="col" className="px-6 py-4 border-l text-center" colSpan={acciones.length}>Permisos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dbPermisos.map((per, idx0) => {
                                                return (
                                                    <tr key={'row-'+idx0.toString()} className="bg-white border-t hover:bg-gray-50">
                                                        <td key={'cell'+idx0.toString()+'name'} className="px-6 py-4">{ per.nombre }</td>
                                                        { 
                                                            per.acciones.map((accion, idx) => {
                                                                return (
                                                                    <td key={"row"+idx0+'-cell'+idx} className="px-6 py-4 border-l text-center">
                                                                        <ToggleSwitchForm idRow={idx0} idCell={idx} id={per.url+idx} name={per.url} text={accion} value={accion} className="admin" isChecked={ isCheck.includes(per.url+idx) } onChange={handleOnChange} />
                                                                    </td>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                )})
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                        <div className='my-5'>
                            <SubmitButtonForm>
                                <i className="bi bi-plus-circle"></i>&nbsp;Guardar nuevo Rol de Usuario
                            </SubmitButtonForm>
                        </div>
                        <div></div>
                    </div>
                </Form>
            </MainContainer>
        </>
    );
};

export default RegistroRol;
