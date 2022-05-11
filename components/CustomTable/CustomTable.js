import React, { useContext, useEffect, useState } from 'react'
import ReactTable from '../ReactTable';
import MomentTimeZone from 'moment-timezone';
import moment from 'moment';


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

  const data = React.useMemo(() => rows.map((row, i) => {
    let { name:nameDisplay, isMember, type, date, timeStamp } = row;
    let dateSplit = date.split("-");
    let timeDisplay = MomentTimeZone.tz(timeStamp, "Asia/Singapore").format("h:mm a");
    let isMemberDisplay = isMember === "y" ? "会友" : "非会友";
    let typeDisplay = type === "online" ? "线上" : "实体";
    let dateDisplay = `${dateSplit[1]}月 ${dateSplit[2]}日 ${dateSplit[0]}年`;
    return { id:i+1 ,name:nameDisplay, isMember:isMemberDisplay, type:typeDisplay, date:dateDisplay, time:timeDisplay }
  }), [rows]);

  return (<ReactTable columns={columns} data={data}/>)
}

export default CustomTable;
