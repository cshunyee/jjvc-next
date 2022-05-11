import React from 'react';
import { CSVLink } from "react-csv";
import MomentTimeZone from 'moment-timezone';
import moment from 'moment';
import styles from './ExportCheckInCSV.module.css';


const ExportCheckInCSV = ({ checkInRecords, fDate, tDate }) => {
  const fromDate = moment(fDate, "YYYY-MM-DD");
  const toDate = moment(tDate, "YYYY-MM-DD");
  if (toDate.isBefore(fromDate)) {
    return alert("日期错误");
  }
  let recordDateName = moment(fromDate).format("YYYY/MM/DD");
  if (toDate !== fromDate) {
    recordDateName += `至${moment(toDate).format("YYYY/MM/DD")}`;
  }

  const headers = [
    { label: "", key: "id" },
    { label: "姓名", key: "name" },
    { label: "崇拜方式", key: "type" },
    { label: "身份", key: "isMember" },
    { label: "日期", key: "date" },
    { label: "时间", key: "time" },
  ]

  const data = React.useMemo(() => checkInRecords.map((row, i) => {
    let { name:nameDisplay, isMember, type, date, timeStamp } = row;
    let dateSplit = date.split("-");
    let timeDisplay = MomentTimeZone.tz(timeStamp, "Asia/Singapore").format("h:mm a");
    let isMemberDisplay = isMember === "y" ? "会友" : "非会友";
    let typeDisplay = type === "online" ? "线上" : "实体";
    let dateDisplay = `${dateSplit[1]}月 ${dateSplit[2]}日 ${dateSplit[0]}年`;
    return { id:i+1 ,name:nameDisplay, isMember:isMemberDisplay, type:typeDisplay, date:dateDisplay, time:timeDisplay }
  }), [checkInRecords]);

  return (
    <CSVLink data={data} headers={headers} filename={`JJVC崇拜点名 ${recordDateName}.csv`} className={`btn ${styles.excelButton}`}>
      Excel
    </CSVLink>
  )
}

export default ExportCheckInCSV;
