import React, {useState} from 'react';
import TableRD from '../Tables/TableRD';

//Encabezados de tablas
const tableHeaders9 = require('../DataTables/Table9.json');
const tableHeaders10 = require('../DataTables/Table10.json');
const tableHeaders11 = require('../DataTables/Table11.json');
const tableHeaders12 = require('../DataTables/Table12.json');


const Pagina5 = () => {
  const [rowData9] = useState(
    [{
      "tipo_vacuna": "Aztra Zeneca/Oxford (ChAd)",
      "total": "46",
      "primera_dosis": "3",
      "segunda_dosis": "9",
      "refuerzo": "34",
      "sin_especificar": "0",
      "porcentaje": "50.55"
    }]
  );

  const [rowData10] = useState(
    [{
      "vacunados_60_y_mas": "60-69 años",
      "total": "10",
      "porcentaje": "22.73"
    }]
  );

  const [rowData11] = useState(
    [{
      "resultado_prueba": "Positivo",
      "cantidad": "99",
      "porcentaje": "72.79"
    }]
  );

  const [rowData12] = useState(
    [{
      "personas_por_hospital": "H. Esp. Dr. Belisario Dominguez",
      "cantidad": "2",
      "porcentaje": "1.47"
    }]
  );

  return (
    <div style={{height: '100vh'}}>
      <div className='grid grid-cols-11 gap-4 pt-2'>
        <div className='col-start-3 col-span-7'>
          <TableRD
            columnDefs={tableHeaders9}
            rowData={rowData9}
            heightValue='30vh'/>
        </div>
        <div className='col-start-2 col-span-3'>
          <TableRD
            columnDefs={tableHeaders10}
            rowData={rowData10}
            heightValue='20vh'/>
          <div className='pt-6'>
            <TableRD
              columnDefs={tableHeaders11}
              rowData={rowData11}
              heightValue='20vh'/>
          </div>
        </div>
        <div className='col-start-7 col-span-3'>
          <TableRD
            columnDefs={tableHeaders12}
            rowData={rowData12}
            heightValue='50vh'/>
        </div>
      </div>
  </div>
  )
}

export default Pagina5