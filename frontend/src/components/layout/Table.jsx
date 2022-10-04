import React from 'react'

const Table = (props) => {
    return (
        <>            
            <div className="relative mt-2 overflow-x-auto border shadow-sm sm:rounded-lg">
                <table className="w-full table-auto text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50"> 
                        <tr>
                            {props.head.map((chead, index, head) => {
                                return (
                                    index < (head.length-1) 
                                    ? 
                                        (
                                            <th key={index} scope="col" id={chead.id} data-toggle="asc" className={`px-6 py-4 border-r ${ chead.className } ${ chead.textAlign }`} onClick={chead.onClick}>
                                                {chead.text}
                                            </th>
                                        )
                                    :
                                        (
                                            <th key={index} scope="col" id={chead.id} data-toggle="asc" className={`px-6 py-4 ${ chead.className } ${ chead.textAlign }`}  onClick={chead.onClick}>
                                                {chead.text}
                                            </th>
                                        )
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {props.children}
                    </tbody>
                </table>
            </div>        
        </>
    );
};

const TableRow = (props) => {
    return (
        <>
            <tr key={'row'+props.idRow} className="bg-white border-t hover:bg-gray-50">
                {props.children}
            </tr>
        </>
    );
};


const TableCol = (props) => {
    return (    
        <>
            <td key={'row'+props.idRow+'-cell'+props.idCell} className={`px-6 py-4 ${props.border} ${props.textAlign}`}>
                {props.children}
            </td>
        </>
    );
};

export {
    Table,
    TableRow,
    TableCol,
}