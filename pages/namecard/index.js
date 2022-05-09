import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Moment from 'react-moment';
import moment from 'moment';
import MomentTimeZone from 'moment-timezone';
import { Card, Form, Container, Button, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './NameCard.module.css';
import bibleImg from './bible.jpg';
import MyNavBar from '../../components/MyNavBar/MyNavBar';
import CustomTable from '../../components/CustomTable/CustomTable';
import EditDetailModal from '../../components/EditDetailModal/EditDetailModal';
import AuthContext from '../../context/auth-context';
import useInput from '../../hooks/use-input';
import CustomInputGroup from '../../UI/CustomInputGroup';


const getTime = (formatType, time=null) => {
  const theTime = time ? time : new Date().getTime();
  return MomentTimeZone.tz(theTime, "Asia/Singapore").format(formatType);
}

// ------------ PUBLIC USESAGE ------------ //
const CHECKIN_TABLE = "https://jjvc-7665d-default-rtdb.asia-southeast1.firebasedatabase.app/checkins.json";
const TYPE_DICT = { online : "线上", walkin: "实体" };
const filterUserCheckInRecord = (records, uid) => {
  if (records.length > 0) {
    let todayCheckInRecord = records.filter(record => record.uid === uid);
    return todayCheckInRecord.length ? todayCheckInRecord[0] : null;
  }
  return null
}


const NameCard = (props) => {
  // ------------ DECLARATION ------------ //
  const authCtx = useContext(AuthContext);
  const [modalShow, setModalShow] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [userCheckInRecord, setUserCheckInRecord] = useState({});
  const [checkInTime, setCheckInTime] = useState("");
  const [currTime, setCurrTime] = useState("Loading...");
  const [currDate, setCurrDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const fullDate = `${currDate.day}-${currDate.month}-${currDate.year}`;
  const userInfo = {
    fullname: authCtx.name || "",
    phone: authCtx.phone || "",
    memberDisplay: authCtx.isMember === "y" ? "本堂会友" : "非会友" || null
  };

  useEffect(() => {
    authCtx.authenticateToken("/namecard");
  }, [authCtx.isLoggedIn]);

  useEffect(() => {
    let increaseTimeTimer = setInterval(() => setCurrTime(getTime("h:mm:ss a")), 1000);
    return () => {
        clearInterval(increaseTimeTimer);
      };
  },[]);

  useEffect(() => {
    const record = filterUserCheckInRecord(props.checkInRecords, authCtx.uid);
    if (!hasCheckedIn && record) {
      setHasCheckedIn(true);
      setUserCheckInRecord(record);
      setCheckInTime(getTime("h:mm:ss a"), record.timeStamp);
    }
  })

  const {
    value: checkInTypeValue,
    isValid: checkInTypeIsValid,
    hasError: checkInTypeHasError,
    inputChangeHandler: checkInTypeChangeHandler,
    inputBlurHandler: checkInTypeBlurHandler,
    reset: resetCheckInType
  } = useInput((value) => value.trim() !== '' && value.trim() !== null);

  let formIsValid = false;
  if (checkInTypeIsValid) {
    formIsValid = true;
  }

  const checkInTypeInputClasses = checkInTypeHasError
    ? `mb-3 ${styles.invalid}`
    : `mb-3`;

  const submitBtnClasses = formIsValid && !hasCheckedIn
    ? styles.button
    : `${styles.button} disabled`;

  // ------------ FUNCTION ------------ //
  const showModal = () => {
    setModalShow(true);
  }

  const checkHasCheckedIn = async(uid) => {
    const checkInRecord = await getCheckInRecord();
    return checkInRecord ? true : false;
  }

  const getCheckInRecord = async (uid) => {
    const response = await fetch(`${CHECKIN_TABLE}?orderBy="date"&equalTo="${fullDate}"`);
    const resJson = await response.json();
    const records = Object.values(resJson);
    return filterUserCheckInRecord(records, uid);
  }

  const createCheckInRecord = async (uid) => {
    const timeStamp = new Date().getTime();
    const response = await fetch(CHECKIN_TABLE, {
      method: "POST",
      body: JSON.stringify({
        uid: uid,
        date: fullDate,
        time: getTime("HH:mm:ss"),
        timeStamp: timeStamp,
        type: checkInTypeValue, //online or walkin
        name: authCtx.name,
        email: authCtx.email,
        phone: authCtx.phone,
        isMember: authCtx.isMember
      })
    });
    const recordJson = await response.json();
    if (response.ok) {
      return {timeStamp: timeStamp};
    }
    return {errorMsg: recordJson.error.message};
  }

  const onCheckIn = async() => {
    const userHasCheckedIn = await checkHasCheckedIn(authCtx.uid);
    if (userHasCheckedIn) {
      setHasCheckedIn(true);
      return
    }
    const checkInRes = createCheckInRecord(authCtx.uid);
    if (checkInRes && checkInRes.errorMsg) {
      alert("系统错误：请联系系统管理员");
      return
    }
    setHasCheckedIn(true);
    setCheckInTime(getTime("h:mm:ss a", checkInRes.timeStamp));
  }

  const compareTime = moment(checkInTime, 'h:mm a');
  const latestTime = moment('9:30 am', 'h:mm a');
  const checkInTimeClasses = compareTime.isBefore(latestTime) ? styles["text-green"] : styles["text-yellow"];

  // ------------ JXS RETURN ------------ //
  return <React.Fragment>
    <MyNavBar />
    <section className={styles.nameCardSection}>
      <Container className={styles.container}>
        <div className={styles["title"]}>
          <h3>会友点名卡</h3>
          <hr className={styles.breakline} />
        </div>
        <Card border="light" bg="light" text="dark" className={styles.card}>
            <Row>
              <Col className={styles.imgCol}><Image src={bibleImg}></Image></Col>
              <Col className={styles.rightCol}>
                <div className={styles.editBtn} onClick={showModal}>
                  <FontAwesomeIcon icon="pen-to-square" /> 编辑
                </div>
                <Row className={styles.row}>
                  <Col>姓名 </Col>
                  <Col xs={7}><input className="form-control" value={userInfo.fullname} disabled></input></Col>
                </Row>
                <Row className={styles.row}>
                  <Col>电话号码 </Col>
                  <Col xs={7}><input className="form-control" value={userInfo.phone} disabled></input></Col>
                </Row>
                <Row className={styles.row}>
                  <Col>崇拜方式 </Col>
                  <Col xs={7}>
                    <CustomInputGroup
                      hasValidation="true" className={checkInTypeInputClasses} type="select" placeholder="请选择" onChange={checkInTypeChangeHandler} onBlur={checkInTypeBlurHandler} customKey="namecard-checkInType"
                      value={hasCheckedIn ? userCheckInRecord.type : checkInTypeValue} option={[{display:"线上", value:"online"}, {display: "实体", value:"walkin"}]}
                      isInvalid={checkInTypeHasError} feedback="请选其一" disabled={hasCheckedIn}/>
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col>身份 <span className={styles.engText}></span></Col>
                  <Col xs={7}><input className="form-control" value={userInfo.memberDisplay} disabled></input></Col>
                </Row>
                <Row className={styles.row}>
                  <Col>日期 </Col>
                  <Col xs={7}>
                    {`${currDate.month}月 ${currDate.day}日 ${currDate.year}年`}
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Col>时间 </Col>
                  <Col xs={7}>
                      {currTime}
                  </Col>
                </Row>
                <div className="text-center">
                  <Button className={submitBtnClasses} onClick={onCheckIn}>点名</Button>
                </div>
                <div className={styles.checkedInText}>
                  {hasCheckedIn && <span>今日已点名 —— <span className={checkInTimeClasses}>{checkInTime}</span></span>}
                </div>
              </Col>
            </Row>
        </Card>
      </Container>
    </section>

    {
      authCtx.privilege === "admin" && <section className={styles.checkInTableSection}>
        <Container>
          <CustomTable rows={props.checkInRecords}/>
        </Container>
      </section>
    }
    <footer className={styles.footer}>
      <small>@ copyright 十玖</small>
    </footer>

    <EditDetailModal
        needHeader={false}
        name={authCtx.name}
        email={authCtx.email}
        phone={authCtx.phone}
        isMember={authCtx.isMember}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
  </React.Fragment>
}

export async function getStaticProps(context) {
  const fullDate = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
  const response = await fetch(`${CHECKIN_TABLE}?orderBy="date"&equalTo="${fullDate}"`);
  const resJson = await response.json();
  const records = Object.values(resJson);
  let todayCheckInRecords = records.length > 0 ? records : [];
  return {
    props: {
      checkInRecords: todayCheckInRecords
    }
  }
}

export default NameCard;
