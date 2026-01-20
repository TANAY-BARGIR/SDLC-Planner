import { useState } from "react";
import { Link } from "react-router-dom";
import DiamondGallery from "../components/DiamondGallery";

const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  return (
    <div className="page-container">
      <div className="grid-layout">
        <div className="left-column">
          <div className="card">
            <h2 className="gradient-text" style={{ fontSize: "2rem" }}>
              Welcome Back
            </h2>
            <p className="subtitle" style={{ fontSize: "1rem" }}>
              Login to continue
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username or Email</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn-primary btn-full">
                Login
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#718096" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#667eea",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="right-column">
          <DiamondGallery />
        </div>
      </div>
    </div>
  );
};

export default Login;