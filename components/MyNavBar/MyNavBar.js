import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Card, Form, Container, Button, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import styles from './MyNavBar.module.css';
import AuthContext from '../../context/auth-context';


const MyNavBar = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
  }

  return <Navbar className={styles.nav}>
    <Container className={styles.navContainer}>
      <Navbar.Brand href="#" className={styles.navLogo} onClick={() => navigate("/")}>JJVC</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="#" onClick={() => navigate("/")}>Home</Nav.Link>
          <Nav.Link href="#" onClick={authCtx.logout}>Logout</Nav.Link>
          {/* <Nav.Link href="#link">Link</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown> */}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
}

export default MyNavBar;
