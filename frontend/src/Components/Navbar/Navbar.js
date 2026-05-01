import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import "./Navbar.css";

export default function AppNavbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="app-navbar" sticky="top">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="navbar-brand-custom">
          <span className="brand-icon">◈</span> Edge Extraction
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" className="navbar-toggler-custom" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/album">Album</Nav.Link>
            <Nav.Link as={NavLink} to="/convert">Convert</Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center gap-2">
            {currentUser && (
              <span className="navbar-user">
                👤 {currentUser}
              </span>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
