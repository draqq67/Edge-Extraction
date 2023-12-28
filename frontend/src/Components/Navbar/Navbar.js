import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import "./Navbar.css"
function BasicExample() {
  return (
    <Navbar expand="lg" className="p-3 mb- bg-secondary bg-gradient">
        <Navbar.Brand href="#top">Edge Extraction</Navbar.Brand>
        <Navbar.Toggle className='navbar-toggler ml-auto hidden-sm-up float-xs-right' data-toggle="collapse"
         data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
          aria-label="Toggle navigation"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/album">Album</Nav.Link>
            <Nav.Link href="/convert">Convert</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default BasicExample;