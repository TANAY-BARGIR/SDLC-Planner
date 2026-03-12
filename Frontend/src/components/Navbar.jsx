import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-morphism px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer" data-purpose="branding">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
            <svg className="text-white" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-white">SDLC <span className="gradient-text">PRO</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/planner" className="hover:text-white transition-colors">Strategic Planner</Link>
        </nav>
        <div className="flex items-center gap-4">
          {token ? (
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Log Out</button>
          ) : (
            <Link to="/login" className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors font-medium">Log In</Link>
          )}
          <Link to="/planner" className="bg-brand-600 hover:bg-brand-500 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover-lift glow-effect text-white">
            <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            New Blueprint
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
