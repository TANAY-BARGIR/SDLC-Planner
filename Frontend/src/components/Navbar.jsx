import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <h1>SDLC Planner</h1>
      </Link>
      <div className="nav-links">
        <Link to="/login">
          <button className="btn-nav-login">Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn-nav-signup">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;