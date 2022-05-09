import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import styles from './EditDetailModal.module.css';
import CustomInputGroup from '../../UI/CustomInputGroup';
import useInput from '../../hooks/use-input';


const isNumeric = (val) => {
    return /^-?\d+$/.test(val);
}

const EditDetailModal = (props) => {
  const [invalidPasswordMsg, setInvalidPasswordMsg] = useState(null);
  useEffect(() => {
    console.log("call")
    emailChangeHandler({target:{value: props.email || ""}});
    nameChangeHandler({target:{value: props.name || ""}});
    phoneChangeHandler({target:{value: props.phone || ""}});
    isMemberChangeHandler({target:{value: props.isMember || ""}});
  },[props.email, props.name, props.isMember, props.phone]);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail
  } = useInput((value) => value.includes('@'));
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

  let formIsValid = false;
  if (emailIsValid && nameIsValid && phoneIsValid && isMemberIsValid && (emailValue !== props.email || nameValue !== props.name || phoneValue !== props.phone || isMemberValue !== props.isMember)) {
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

  const submitBtnClasses = formIsValid
    ? styles.submitBtn
    : `${styles.submitBtn} disabled`;

  const onUpdate = () => {

  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      className={styles.modal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {
        props.needHeader &&
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" >
            编辑资料
          </Modal.Title>
        </Modal.Header>
      }
      <Modal.Body>
      <div className={styles["title"]}>
        <h3>编辑资料</h3>
        <hr className={styles.breakline} />
      </div>
      {invalidPasswordMsg && <Alert key="danger" variant="danger" className={styles.invalidMsg}>
        {invalidPasswordMsg}
      </Alert>}
      <Form onSubmit={onUpdate}>
        <CustomInputGroup
            hasValidation="true" className={emailInputClasses} prepend="" placeholder="用户名 Username" type="email" inputClass="p-3" onChange={emailChangeHandler} onBlur={emailBlurHandler} value={emailValue}
            autoComplete="username" disabled={true}
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
            hasValidation="true" className={isMemberInputClasses} type="select" placeholder="本教会会友" inputClass="p-3" onChange={isMemberChangeHandler} onBlur={isMemberBlurHandler} customKey="register-isMember"
            value={isMemberValue} option={[{display:"是", value:"y"}, {display: "不是", value:"n"}]}
            isInvalid={isMemberHasError} feedback="请选其一"/>
        <Button className={submitBtnClasses} type="submit">更新<br/><span>Save</span></Button>
      </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditDetailModal;
