import React, {useState} from 'react';
import TableRD from '../Tables/TableRD';

//Encabezados de tablas
const tableHeaders6 = require('../DataTables/Table6.json');
const tableHeaders7 = require('../DataTables/Table7.json');
const tableHeaders8 = require('../DataTables/Table8.json');

const Pagina4 = () => {
  const [rowData6] = useState(
    [{
      "entidad_federativa": "Ciudad de México",
      "cantidad": "112",
      "porcentaje": "82.35"
    }]
  );

  const [rowData7] = useState(
    [{
      "ventilador": "Con ventilador",
      "cantidad": "10",
      "porcentaje": "7.35"
    }]
  );

  const [rowData8] = useState(
    [{
      "antecedente": "Si",
      "cantidad": "91",
      "porcentaje": "66.91"
    }]
  );

  return (
    <div style={{height: '100vh'}}>
      <div className='grid grid-cols-8 gap-3 pt-2'>
        <div className='col-start-4 col-span-2'>
          <TableRD
            columnDefs={tableHeaders6}
            rowData={rowData6}
            heightValue='25vh'/>
          <div className='pt-4'>
            <TableRD
              columnDefs={tableHeaders7}
              rowData={rowData7}
              heightValue='25vh'/>
          </div>
          <div className='pt-4'>
            <TableRD
              columnDefs={tableHeaders8}
              rowData={rowData8}
              heightValue='25vh'/>
          </div>
        </div>
      </div>
  </div>
  )
}

export default Pagina4