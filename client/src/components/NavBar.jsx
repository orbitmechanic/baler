import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

function Navigation(props){
  return(
    <>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="/Home">Baler</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/Home">Home</Nav.Link>
            <Nav.Link href="/Creation">Something</Nav.Link>
            <Nav.Link href="/Elections">Something Else</Nav.Link>
            <Nav.Link href="/Results">Something Different</Nav.Link>
          </Nav>
        </Navbar>
    </>
  );
}


export default Navigation;
