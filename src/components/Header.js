import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { LOGOUT } from '../constants';
import { AuthContext } from '../AuthConfig';

const Header = () => {
  const { authState, authDispatch } = useContext(AuthContext);

  const handleLogout = () => {
    authDispatch({ type: LOGOUT });
  };

  return (
    <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>HL7 Medical Practitioner</Navbar.Brand>
      {authState && authState.mp && authState.token ? (
        <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">
                Accessible Patients
              </Nav.Link>
              <Nav.Link as={Link} to="/search">
                Search
              </Nav.Link>
              <Nav.Link as={Link} to="/add/patient">
                Add New Patient
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>
      ) : null}
    </Navbar>
  );
};

export default Header;
