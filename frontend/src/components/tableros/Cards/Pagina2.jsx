import React,{ useState } from 'react'
import TableRD from '../Tables/TableRD';

//Charts
import PieChart from '../Charts/PieChart';
import BarChartCategory from '../Charts/BarChartCategory';

//Encabezado de tablas
const tableHeaders2 = require('../DataTables/Table2.json');

const Pagina2 = () => {
  const [rowData] = useState(
    [{
      "unidad_medica": "Total general",
      "total_hoy": "50",
      "total_acumulado": "150"
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
      <div className='px-10'>
        <TableRD
        columnDefs={tableHeaders2}
        rowData={rowData}/>
      </div>
      <div className='grid grid-cols-10 gap-3 pt-2'>
        <div id='pagina2Genero' className='chart col-start-2 col-span-4'>
          <PieChart
            id_chart='pagina2Genero'
            textTitle='Pacientes por sexo'
            dataChart={pieData}
            categoryField='genero'
            valueField='porcentaje'
            />
        </div>
        <div id='pagina2Edad' className='chart col-start-6 col-span-4'>
          <BarChartCategory
            id_chart='pagina2Edad'
            dataChart={barData}
            valueYField='value'
            categoryField={'range'}/>
        </div>
      </div>
    </div>
  );
};

export default Pagina2;