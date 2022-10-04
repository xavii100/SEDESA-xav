import React, {useMemo} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../../../css/style-ag-grid.css';

const TableRD = ({columnDefs, rowData, heightValue = '55vh'}) => {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultColDef = useMemo( ()=> ({
      sortable: false,
      wrapHeaderText: true,
      autoHeaderHeight: true
    }));

  return (
    <div className="ag-theme-alpine" style={{width: '100%', height: heightValue}}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        />
    </div>
  );
};

export default TableRD;