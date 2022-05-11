import React, { useContext, useEffect, useState } from 'react'
import ReactTable from '../ReactTable';


const CustomTable = ({ rows }) => {

  const columns = React.useMemo(() => [
    {
      Header: '',
      accessor: 'id'
    }, {
      Header: '姓名',
      accessor: 'name'
    }, {
      Header: '崇拜方式',
      accessor: 'type'
    }, {
      Header: '身份',
      accessor: 'isMember'
    }, {
      Header: '日期',
      accessor: 'date'
    }, {
      Header: '时间',
      accessor: 'time'
    }
  ], []);

  return (<ReactTable columns={columns} data={rows}/>)
}

export default CustomTable;
