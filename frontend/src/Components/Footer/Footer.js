import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-text">
          Project by{" "}
          Badara Denisa
          Gheorghe Bianca
          Zarnescu Dragos
          {" "}— Interfețe grafice pentru dispozitive fixe și mobile
        </span>
        <div className="footer-links">
          <a href="#!" className="fa fa-facebook-f fa-lg" aria-label="Facebook" />
          <a href="#!" className="fa fa-instagram fa-lg" aria-label="Instagram" />
          <a href="#!" className="fa fa-linkedin fa-lg" aria-label="LinkedIn" />
        </div>
      </div>
    </footer>
  );
}
