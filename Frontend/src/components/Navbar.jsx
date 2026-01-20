// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react"; // Icon

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo Section */}
        <Link to="/" className="nav-brand">
          <BrainCircuit size={28} />
          <span>SDLC Architect</span>
        </Link>

        {/* Right Actions */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            to="/login"
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem" }}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="btn btn-primary"
            style={{ padding: "0.5rem 1rem" }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
