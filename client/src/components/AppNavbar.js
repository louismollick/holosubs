import React from 'react';
import { Navbar, Nav } from "react-bootstrap";
import VtuberScrollbar from './VtuberScrollbar';

const AppNavbar = ({ vtuberid, setVtuberId }) => {
  return (
    <div>
        <Navbar expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/" style={{ margin: '0 3rem' }}>
                <img
                    alt=""
                    src="/logo.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                HoloSubs
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <VtuberScrollbar vtuberid={vtuberid} setVtuberId={setVtuberId}/>
                </Nav>
                {/* <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-info">Search</Button>
                </Form> */}
            </Navbar.Collapse>
        </Navbar>
    </div>
  );
}

export default AppNavbar;