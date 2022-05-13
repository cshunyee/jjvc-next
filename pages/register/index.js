import React, { useEffect, useContext, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Register.module.css';
import { Card, Form, Container, Button, Row, Col, Alert } from 'react-bootstrap';
import CustomInputGroup from '../../UI/CustomInputGroup';
import ButtonBlock from '../../UI/ButtonBlock';
import AuthContext from '../../context/auth-context';
import useInput from '../../hooks/use-input';


const isNumeric = (val) => {
    return /^-?\d+$/.test(val);
}

const Register = () => {
  const authCtx = useContext(AuthContext);
  const [invalidPasswordMsg, setInvalidPasswordMsg] = useState(null);

  useEffect(() => {
    authCtx.authenticateToken("/register");
  }, [authCtx.isLoggedIn]);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail
  } = useInput((value) => value.includes('@'));
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword
  } = useInput((value) => value.trim() !== '');
  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    inputChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    reset: confirmResetPassword
  } = useInput((value) => value.trim() === passwordValue);
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    inputChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName
  } = useInput((value) => value.trim() !== '');
  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    inputChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    reset: resetPhone
  } = useInput((value) => value.trim() !== '' && isNumeric(value));
  const {
    value: isMemberValue,
    isValid: isMemberIsValid,
    hasError: isMemberHasError,
    inputChangeHandler: isMemberChangeHandler,
    inputBlurHandler: isMemberBlurHandler,
    reset: resetIsMemble
  } = useInput((value) => value.trim() !== '');

  const onRegister = async (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return
    }
    let user = {
      email: emailValue,
      password: passwordValue,
      name: nameValue,
      phone: phoneValue,
      isMember: isMemberValue,
      privilege: "user"
    }
    const authResponse = await authCtx.registerWithPwd(user, new Date(new Date().getTime() + 3600000));
    if (authResponse && authResponse.errorMsg) {
      setInvalidPasswordMsg(authResponse.errorMsg);
      return
    }
    authCtx.loginWithPwd(emailValue, passwordValue, new Date(new Date().getTime() + 3600000));
  }

  let formIsValid = false;
  if (passwordIsValid && emailIsValid && confirmPasswordIsValid && nameIsValid && phoneIsValid && isMemberIsValid) {
    formIsValid = true;
  }

  const emailInputClasses = emailHasError
    ? `mb-3 ${styles.input} ${styles.invalid}`
    : `mb-3 ${styles.input}`;

  const nameInputClasses = nameHasError
    ? `mb-3 ${styles.input} ${styles.invalid}`
    : `mb-3 ${styles.input}`;

  const phoneInputClasses = phoneHasError
    ? `mb-3 ${styles.input} ${styles.invalid}`
    : `mb-3 ${styles.input}`;

  const isMemberInputClasses = isMemberHasError
    ? `mb-3 ${styles.input} ${styles.invalid}`
    : `mb-3 ${styles.input}`;

  const passwordInputClasses = passwordHasError
    ? `mb-3 ${styles.input} ${styles.invalid}`
    : `mb-3 ${styles.input}`;

  const confirmPasswordInputClasses = confirmPasswordHasError
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
            <h3>用户注册</h3>
            <hr className={styles.breakline} />
          </div>
          {invalidPasswordMsg && <Alert key="danger" variant="danger" className={styles.invalidMsg}>
            {invalidPasswordMsg}
          </Alert>}
          <Form onSubmit={onRegister}>
            <CustomInputGroup
                hasValidation="true" className={emailInputClasses} prepend="" placeholder="用户名(电子邮件) Email" type="email" inputClass="p-3" onChange={emailChangeHandler} onBlur={emailBlurHandler} value={emailValue}
                autoComplete="username"
                isInvalid={emailHasError} feedback="请输入正确的电子邮件"/>
            <CustomInputGroup
                hasValidation="true" className={nameInputClasses} prepend="" placeholder="真实全名 Fullname" type="text" inputClass="p-3" onChange={nameChangeHandler} onBlur={nameBlurHandler} value={nameValue}
                autoComplete="fullname"
                isInvalid={nameHasError} feedback="真实全名不能为空"/>
            <CustomInputGroup
                hasValidation="true" className={phoneInputClasses} prepend="" placeholder="电话号码 Phone number" type="text" inputClass="p-3" onChange={phoneChangeHandler} onBlur={phoneBlurHandler} value={phoneValue}
                autoComplete="phone"
                isInvalid={phoneHasError} feedback="电话号码不能为空 / 只能包含数字"/>
            <CustomInputGroup
                hasValidation="true" className={isMemberInputClasses} type="select" placeholder="是否为本教会会友" inputClass="p-3" onChange={isMemberChangeHandler} onBlur={isMemberBlurHandler} customKey="register-isMember"
                value={isMemberValue} option={[{display:"是", value:"y"}, {display: "不是", value:"n"}]}
                isInvalid={isMemberHasError} feedback="请选其一"/>
            <CustomInputGroup
                hasValidation="true" className={passwordInputClasses} inputClass="p-3" prepend="" placeholder="密码 Password" type="password" onChange={passwordChangeHandler} onBlur={passwordBlurHandler}
                value={passwordValue}
                autoComplete="current-password"
                isInvalid={passwordHasError}
                feedback="请输入密码"/>
            <CustomInputGroup
                hasValidation="true" className={confirmPasswordInputClasses} inputClass="p-3" prepend="" placeholder="密码 Password" type="password" onChange={confirmPasswordChangeHandler} onBlur={confirmPasswordBlurHandler}
                value={confirmPasswordValue}
                autoComplete="current-password"
                isInvalid={confirmPasswordHasError}
                feedback="密码不一致"/>
            <Button className={submitBtnClasses} type="submit">注册<br/><span>Register</span></Button>
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

export default Register;
