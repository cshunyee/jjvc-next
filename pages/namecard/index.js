import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Moment from 'react-moment';
import { Card, Form, Container, Button, Row, Col } from 'react-bootstrap';
import styles from './NameCard.module.css';
import bibleImg from './bible.jpg';
import AuthContext from '../../context/auth-context';
import useInput from '../../hooks/use-input';
import CustomInputGroup from '../../UI/CustomInputGroup';


const NameCard = () => {
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const time = new Date().getTime();
  const authCtx = useContext(AuthContext);
  const userInfo = {
    fullname: authCtx.name,
    phone: authCtx.phone,
    memberDisplay: authCtx.isMember === "y" ? "本堂会友" : "非会友"
  };

  useEffect(() => {
    authCtx.authenticateToken("/namecard");
  }, [authCtx.isLoggedIn]);

  const {
    value: checkInTypeValue,
    isValid: checkInTypeIsValid,
    hasError: checkInTypeHasError,
    inputChangeHandler: checkInTypeChangeHandler,
    inputBlurHandler: checkInTypeBlurHandler,
    reset: resetCheckInType
  } = useInput((value) => value.trim() !== '' && value.trim() !== null);

  const onCheckIn = () => {
    console.log(checkInTypeValue)
  }

  let formIsValid = false;
  if (checkInTypeIsValid) {
    formIsValid = true;
  }

  const checkInTypeInputClasses = checkInTypeHasError
    ? `mb-3 ${styles.invalid}`
    : `mb-3`;

  const submitBtnClasses = formIsValid
    ? styles.button
    : `${styles.button} disabled`;

  return <React.Fragment>
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
                      value={checkInTypeValue} option={[{display:"线上", value:"online"}, {display: "实体", value:"walkin"}]}
                      isInvalid={checkInTypeHasError} feedback="请选其一"/>
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col>身份 <span className={styles.engText}></span></Col>
                <Col xs={7}><input className="form-control" value={userInfo.memberDisplay} disabled></input></Col>
              </Row>
              <Row className={styles.row}>
                <Col>日期 </Col>
                <Col xs={7}>
                  {`${month}月 ${day}日 ${year}年`}
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col>时间 </Col>
                <Col xs={7}>
                  <Moment format="h:mm a">
                    {time}
                  </Moment>
                </Col>
              </Row>
              <div className="text-center">
                <Button className={submitBtnClasses} onClick={onCheckIn}>点名</Button>
              </div>
            </Col>
          </Row>
      </Card>
    </Container>
  </section>
  <footer className={styles.footer}>
    <small>@ copyright 十玖</small>
  </footer>
  </React.Fragment>
}

export default NameCard;
