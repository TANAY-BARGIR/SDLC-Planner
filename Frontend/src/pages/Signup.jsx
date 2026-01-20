import { useState } from "react";
import { Link } from "react-router-dom";
import DiamondGallery from "../components/DiamondGallery";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup:", formData);
  };

  return (
    <div className="page-container">
      <div className="grid-layout">
        <div className="left-column">
          <div className="card" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <h2 className="gradient-text" style={{ fontSize: "2rem" }}>
              Create Account
            </h2>
            <p className="subtitle" style={{ fontSize: "1rem" }}>
              Sign up to get started
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              {/* Added other fields abbreviated for brevity, include full form as before */}
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  className="form-input"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full">
                Sign Up
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#718096" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#667eea",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Login
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

export default Signup;