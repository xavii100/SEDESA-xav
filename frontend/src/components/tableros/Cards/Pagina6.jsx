import React, {useState} from 'react';
import TableRD from '../Tables/TableRD';

//Encabezados de tablas
const tableHeaders13 = require('../DataTables/Table13.json');
const tableHeaders14 = require('../DataTables/Table14.json');

const Pagina6 = () => {
  const [rowData13] = useState(
    [{
      "comorbilidad_nombre": "ASMA",
      "comorbilidad_1": "0",
      "comorbilidad_2": "0",
      "comorbilidad_3": "0"
    }]
  );

  const [rowData14] = useState(
    [{
      "comorbilidad_60_y_mas": "ASMA",
      "comorbilidad_60_y_mas_1": "0",
      "comorbilidad_60_y_mas_2": "0",
      "comorbilidad_60_y_mas_3": "0"
    }]
  );

  return (
    <div style={{height: '100vh'}}>
      <div className='grid grid-cols-9 gap-3 pt-2'>
        <div className='col-start-4 col-span-3'>
          <TableRD
            columnDefs={tableHeaders13}
            rowData={rowData13}
            heightValue='25vh'/>
          <div className='pt-6'>
            <TableRD
              columnDefs={tableHeaders14}
              rowData={rowData14}
              heightValue='25vh'/>
          </div>
        </div>
      </div>
  </div>
  )
}

export default Pagina6