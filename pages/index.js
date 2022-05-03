import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from "next/link";
import styles from '../styles/Home.module.css';
import crossImg from '../public/cross.jpg';
import AuthContext from '../context/auth-context';

import { Card, Form, Container, Button , CardGroup, Row, Col } from 'react-bootstrap';

export default function Home() {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    authCtx.authenticateToken("/");
  }, [authCtx.isLoggedIn]);

  return (
    <React.Fragment>
      <Head>
        <title>Welcome to JJVC</title>
        <meta name="description" content="Private website for JJVCians" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={styles.imageSection}>
        <Image src={crossImg} className={styles.img}/>
        <div className={styles.blackDrop}></div>
        <div className={styles.text}>
          <h3 className={styles.title}>Welcome to JJVC Church</h3>
          <br/>
          <h3 className={styles.titleChinese}>新山柔佛再也异象基督教会·欢迎你</h3>
        </div>
      </section>

      <div className={styles["title-1"]}>
        <h3>崇拜详情</h3>
        <hr className={styles.breakline} />
      </div>
      <section className={styles.detailSection}>
        <Container>
          <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={2} className="g-5">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Col key={`card-${idx}`} auto="true">
                <Card className={styles.card}>
                  <Card.Body>
                    <h4>方式一·实体</h4><br/>
                    <span className={styles["card-title"]}>详情</span>
                    <Card.Text>
                      {/* <hr className={styles.breakline}/> */}
                      地点：{idx === 0 ? "JJVC异象基督教会" : "JJVC教会Online Zoom"}<br/>
                      时间：每周日·早上9.30分
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className={styles["card-footer"]}>{idx === 0 ? <i>* 如需要交通请联系xxx弟兄姐妹</i> : <i>* 更多详情请前往 JJVC Whatsapps</i>}</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <div className={styles["title-2"]}>
        <h3>{authCtx.isLoggedIn ? "进入点名" : "登入或注册"}</h3>
        <hr className={styles.breakline} />
      </div>
      {
        !authCtx.isLoggedIn &&
          <section className={styles.loginSection}>
            <Link href="/login"><Button className={`${styles["yellow-button"]} ${styles.button}`}>登入<br/><span>Login</span></Button></Link>
            <Link href="/register"><Button className={`${styles["green-button"]} ${styles.button}`}>注册<br/><span>Register</span></Button></Link>
          </section>
      }
      {
        authCtx.isLoggedIn &&
          <section className={styles.loginSection}>
            <Link href="/namecard"><Button className={`${styles["green-button"]} ${styles.button}`}>点名卡<br/><span>Check In</span></Button></Link>
          </section>
      }

      <footer className={styles.footer}>
        <small>@ copyright 十玖</small>
      </footer>
    </React.Fragment>
  )
}
