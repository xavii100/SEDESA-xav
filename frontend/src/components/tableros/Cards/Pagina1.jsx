import React, {useState} from 'react';
import TableRD from '../Tables/TableRD';

//Charts
import PieChart from '../Charts/PieChart';
import BarChartCategory from '../Charts/BarChartCategory';

//Encabezado de tabla
const tableHeaders1 = require('../DataTables/Table1.json');

const Pagina1 = () => {
  const [rowData] = useState(
    [{
      "unidad_medica": "Unidad Médica Temporal Ajusco Medio",
      "total_ingreso_hoy": "10",
      "total_pacientes_hoy": "20"
    }]
  );

  const [pieData] = useState([
    {
      "genero": "Mujeres",
      "porcentaje": "57"
    },
    {
      "genero": "Hombres",
      "porcentaje": "43"
    }
  ]);

  const [barData] = useState([
    {
      "range": "0-9",
      "value": 3.5
    },
    {
      "range": "10-19",
      "value": 1.9
    },
    {
      "range": "20-29",
      "value": 9.5
    },
    {
      "range": "30-39",
      "value": 7.3
    },
    {
      "range": "40-49",
      "value": 10.6
    }
  ]);

  return (
    <div style={{height: '100vh'}}>
      <div className='grid grid-cols-10 gap-1 pt-4'>
        <div className='col-start-2 col-span-8'>
          <TableRD
            columnDefs={tableHeaders1}
            rowData={rowData}/>
        </div>
      </div>
      <div className='grid grid-cols-10 gap-3 pt-2'>
        <div id='pagina1Genero' className='chart col-start-2 col-span-4'>
          <PieChart
            id_chart='pagina1Genero'
            textTitle='Pacientes por sexo'
            dataChart={pieData}
            categoryField='genero'
            valueField='porcentaje'
            />
        </div>
        <div id='pagina1Edad' className='chart col-start-6 col-span-4'>
          <BarChartCategory
            id_chart='pagina1Edad'
            dataChart={barData}
            valueYField='value'
            categoryField='range'/>
        </div>
      </div>
    </div>
  );
};

export default Pagina1;