import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Login.module.css';
import { Card, Form, Container, Button, Row, Col, Alert } from 'react-bootstrap';
import CustomInputGroup from '../../UI/CustomInputGroup';
import ButtonBlock from '../../UI/ButtonBlock';
import AuthContext from '../../context/auth-context';
import useInput from '../../hooks/use-input';


const Login = () => {
  const authCtx = useContext(AuthContext);
  const [invalidLoginInfoMsg, setInvalidLoginInfoMsg] = useState(null);

  useEffect(() => {
    authCtx.authenticateToken("/login");
  }, [authCtx.isLoggedIn]);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail
  } = useInput((value) => value.trim() !== '');
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword
  } = useInput((value) => value.trim() !== '');

  const onSignIn = async (event) => {
    event.preventDefault();
    const authResponse = await authCtx.loginWithPwd(emailValue, passwordValue, new Date(new Date().getTime() + 3600000));
    if (authResponse && authResponse.errorMsg) {
      setInvalidLoginInfoMsg(authResponse.errorMsg);
      return
    }
  }

  let formIsValid = false;
  if (passwordIsValid && emailIsValid) {
    formIsValid = true;
  }

  const emailInputClasses = emailHasError
    ? `mb-3 ${styles.input} ${styles.invalid}`
    : `mb-3 ${styles.input}`;

  const passwordInputClasses = passwordHasError
    ? `mb-3 ${styles.input} ${styles.invalid}`
    : `mb-3 ${styles.input}`;
  const submitBtnClasses = formIsValid
    ? styles.submitBtn
    : `${styles.submitBtn} disabled`;


  return <React.Fragment>
    <section className={styles.loginSection}>
    <Container className={styles.container}>
      <Card border="light" bg="light" text="dark" className={`mb-3 p-3 ${styles.card}`}>
        <Card.Body>
          <div className={styles["title"]}>
            <h3>用户登入</h3>
            <hr className={styles.breakline} />
          </div>
          {invalidLoginInfoMsg && <Alert key="danger" variant="danger" className={styles.invalidMsg}>
            {invalidLoginInfoMsg}
          </Alert>}
          <Form onSubmit={onSignIn}>
            <CustomInputGroup
                hasValidation="true" className={emailInputClasses} prepend="" placeholder="用户名 Username" type="email" inputClass="p-3" onChange={emailChangeHandler} onBlur={emailBlurHandler} value={emailValue}
                autoComplete="username"
                isInvalid={emailHasError} feedback="用户名不能为空"/>
            <CustomInputGroup
                hasValidation="true" className={passwordInputClasses} inputClass="p-3" prepend="" placeholder="密码 Password" type="password" onChange={passwordChangeHandler} onBlur={passwordBlurHandler}
                value={passwordValue}
                autoComplete="current-password"
                isInvalid={passwordHasError}
                feedback="请输入密码"/>
            <Button className={submitBtnClasses} type="submit">登入<br/><span>Login</span></Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  </section>
  <footer className={styles.footer}>
    <small>@ copyright 十玖</small>
  </footer>
  </React.Fragment>
}

export default Login;
