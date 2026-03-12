import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.identifier,
          password: formData.password,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/planner");
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center min-h-[80vh] animate-fade-in">
      <div className="glass-morphism p-8 md:p-12 rounded-3xl w-full max-w-md hover-lift">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-slate-400">
            Please enter your details to sign in.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input
              type="text"
              className={`w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 border-red-500/30' : 'focus:ring-brand-500'}`}
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <input
              type="password"
              className={`w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 border-red-500/30' : 'focus:ring-brand-500'}`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center transition-all hover-lift glow-effect disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-brand-400 font-bold hover:text-brand-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
