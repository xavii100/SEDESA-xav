import React, {useState} from 'react';
import TableRD from '../Tables/TableRD';

//Encabezados de tablas
const tableHeaders3 = require('../DataTables/Table3.json');
const tableHeaders4 = require('../DataTables/Table4.json');
const tableHeaders5 = require('../DataTables/Table5.json');

const Pagina3 = () => {
  const [rowData3] = useState(
    [{
      "grupo": "0-9 años",
      "total": "6",
      "porcentaje": "4.41"
    }]
  );

  const [rowData4] = useState(
    [{
      "sexo": "Femenino",
      "cantidad": "70",
      "porcentaje": "51.47"
    }]
  );

  const [rowData5] = useState(
    [{
      "alcaldia": "Alvaro Obregón",
      "cantidad": "17",
      "porcentaje": "12.50"
    }]
  );

  return (
    <div style={{height: '100vh'}}>
      <div className='grid grid-cols-11 gap-3 pt-2'>
        <div className='col-start-2 col-span-2'>
          <TableRD
            columnDefs={tableHeaders3}
            rowData={rowData3}
            heightValue='40vh'/>
        </div>
        <div className='col-start-5 col-span-2'>
          <TableRD
            columnDefs={tableHeaders4}
            rowData={rowData4}
            heightValue='20vh'/>
        </div>
        <div className='col-start-8 col-span-3'>
          <TableRD
            columnDefs={tableHeaders5}
            rowData={rowData5}
            heightValue='65vh'/>
        </div>
      </div>
    </div>
  )
}

export default Pagina3