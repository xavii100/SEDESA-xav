import React from 'react';
import { Table, TableRow, TableCol } from "../../components/layout/Table";

const PermissionsDetail = ({permisos}) => {
    const actionIcons = {
        crear: '<i className="bi bi-plus-circle ml-2"></i>',
        editar: '<i className="bi bi-pencil-square ml-2"></i>',
        listar: '<i className="bi bi-table ml-2"></i>',
    }
    // console.log(permisos)

    function getIconsActions(actions) {
        let res = actions.map((action) => {
            return actionIcons[action]
        });
        return res;
    }

    return (
        <>
            <div id="shwPermisos">{permisos.length} {permisos.length === 1 ? 'permiso': 'permisos'} para este rol de usuario</div>
            {
                permisos.map((permiso, idx, permisos) => {
                    // const tableHead = [
                    //     { id: 'numero', text: 'No.' },
                    //     { id: 'gestiones', text: 'Gestiones', className: 'text-center' },
                    //     { text: 'Permisos', className: 'text-center cursor-pointer' },
                    // ]
                    // return (
                    //     // <Table head={tableHead}>
                    //     // </Table>
                    //     <div className='mb-2 w-full'>
                    //         { permiso.cmodulo_vista__nombre }: 
                    //         {
                    //             Object.keys(permiso.acciones).forEach((item) => {
                    //                 if (item === 'crear') return '<i className="bi bi-plus-circle ml-2"></i>'
                    //                 if (item === 'editar') return '<i className="bi bi-pencil-square ml-2"></i>'
                    //                 if (item === 'listar') return '<i className="bi bi-table ml-2"></i>'
                    //             })
                    //         }
                    //     </div>
                    // )
                    //     // <span id={'row'+idx+'-cell4-'+idx} className="bg-gray-100 text-gray-800 text-sm mr-2 md:mr-2 lg:mr-2 xl:mr-3 text-center mr-2 px-2.5 py-0.5 rounded">
                    //     //     {permiso.cmodulo_vista__nombre} : 
                    //     //     {
                    //     //         actions.map((action) => {
                    //     //             return <span dangerouslySetInnerHTML={{__html: actionIcons[action]}} />
                    //     //         })
                    //     //     }
                    //     // </span>
                    // )
                })
            }
        </>
    )
}

export default PermissionsDetail;