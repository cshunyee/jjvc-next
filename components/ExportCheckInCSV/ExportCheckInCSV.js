import React from 'react';
import { CSVLink } from "react-csv";
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

  return (
    <CSVLink data={checkInRecords} headers={headers} filename={`JJVC崇拜点名 ${recordDateName}.csv`} className={`btn ${styles.excelButton}`}>
      Excel
    </CSVLink>
  )
}

export default ExportCheckInCSV;
