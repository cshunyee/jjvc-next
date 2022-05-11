import React, { useState, useEffect } from 'react';
import { FloatingLabel, Row, Col, Form, Container } from 'react-bootstrap';
import moment from 'moment';
import MomentTimeZone from 'moment-timezone';
import styles from './CheckInAdminTable.module.css';
import ExportCheckInCSV from '../ExportCheckInCSV/ExportCheckInCSV';
import CustomTable from '../CustomTable/CustomTable';
import useInput from '../../hooks/use-input';

// Constant
const CHECKIN_TABLE = "https://jjvc-7665d-default-rtdb.asia-southeast1.firebasedatabase.app/checkins.json";

// Main
const CheckInAdminTable = ({rows}) => {
  const [records, setRecords] = useState(rows);

  const {
    value: fromDateValue,
    isValid: fromDateIsValid,
    hasError: fromDateHasError,
    inputChangeHandler: fromDateChangeHandler,
    inputBlurHandler: fromDateBlurHandler,
    reset: resetFromDate
  } = useInput((value) => value.trim() !== '' && value.trim() !== null);

  const {
    value: toDateValue,
    isValid: toDateIsValid,
    hasError: toDateHasError,
    inputChangeHandler: toDateChangeHandler,
    inputBlurHandler: toDateBlurHandler,
    reset: resetToDate
  } = useInput((value) => value.trim() !== '' && value.trim() !== null);

  useEffect(() => {
    if (fromDateValue || toDateValue) {
      return
    }
    fromDateChangeHandler({target:{value: moment(new Date()).format("YYYY-MM-DD")}});
    toDateChangeHandler({target:{value: moment(new Date()).format("YYYY-MM-DD")}});
  },[]);

  useEffect(() => {
    const fromDateTemp = moment(fromDateValue, "YYYY-MM-DD");
    const toDateTemp = moment(toDateValue, "YYYY-MM-DD").add(1, "days");
    if (toDateTemp.isBefore(fromDateTemp)) {
      return alert("日期错误");
    }
    const fromDate = moment(fromDateValue).format("YYYY-MM-DD");
    const toDate = moment(toDateTemp).format("YYYY-MM-DD");

    const fetchData = async () => {
      const response = await fetch(`${CHECKIN_TABLE}?orderBy="date"&startAt="${fromDate}"&endAt="${toDate}"`);
      const resJson = await response.json();
      const results = Object.values(resJson);

      const finalData = results.map((row, i) => {
        let { name:nameDisplay, isMember, type, date, timeStamp } = row;
        let dateSplit = date.split("-");
        let timeDisplay = MomentTimeZone.tz(timeStamp, "Asia/Singapore").format("h:mm a");
        let isMemberDisplay = isMember === "y" ? "会友" : "非会友";
        let typeDisplay = type === "online" ? "线上" : "实体";
        let dateDisplay = `${dateSplit[1]}月 ${dateSplit[2]}日 ${dateSplit[0]}年`;
        return { id:i+1 ,name:nameDisplay, isMember:isMemberDisplay, type:typeDisplay, date:dateDisplay, time:timeDisplay }
      });
      setRecords(finalData)
    }
    fetchData();
  },[fromDateValue, toDateValue, rows]);

  return <section className={styles.checkInTableSection}>
    <Container>
      <Row>
        <Col>
          <FloatingLabel controlId="floatingInput" label="From" className="mb-3">
            <Form.Control type="date" value={fromDateValue} onChange={fromDateChangeHandler}
              max={moment(new Date()).format("YYYY-MM-DD")}/>
          </FloatingLabel>
        </Col>
        <Col xs={1} className="text-center mt-3">至</Col>
        <Col>
          <FloatingLabel controlId="floatingInput" label="To" className="mb-3">
            <Form.Control type="date" value={toDateValue} onChange={toDateChangeHandler}
              max={moment(new Date()).format("YYYY-MM-DD")}/>
          </FloatingLabel>
        </Col>
        <Col className="text-left m-2">
          <ExportCheckInCSV checkInRecords={records} fDate={fromDateValue} tDate={toDateValue}/>
        </Col>
      </Row>
      <CustomTable rows={records} />
    </Container>
  </section>
}

export default CheckInAdminTable;
