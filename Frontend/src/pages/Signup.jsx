import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create account.");
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
      <div className="glass-morphism p-8 md:p-12 rounded-3xl w-full max-w-lg hover-lift">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-white mb-2">
            Create an account
          </h2>
          <p className="text-slate-400">
            Start building better software today.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Username</label>
            <input
              type="text"
              className={`w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 border-red-500/30' : 'focus:ring-brand-500'}`}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input
              type="email"
              className={`w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 border-red-500/30' : 'focus:ring-brand-500'}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              <input
                type="password"
                className={`w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 border-red-500/30' : 'focus:ring-brand-500'}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Confirm</label>
              <input
                type="password"
                className={`w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 border-red-500/30' : 'focus:ring-brand-500'}`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center transition-all hover-lift glow-effect disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-400 font-bold hover:text-brand-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
