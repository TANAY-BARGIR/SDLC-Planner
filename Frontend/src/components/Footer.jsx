import { Link } from "react-router-dom";
import { Layers, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center text-brand-500">
            <Layers size={24} />
          </div>
          <span className="font-display font-extrabold text-lg text-white">SDLC <span className="gradient-text">PRO</span></span>
        </div>
        
        <p className="text-slate-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} SDLC Pro Blueprinting Engine. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4 text-slate-400">
          <Link to="#" className="hover:text-white transition-colors"><Github size={20} /></Link>
          <Link to="#" className="hover:text-white transition-colors"><Twitter size={20} /></Link>
          <Link to="#" className="hover:text-white transition-colors"><Linkedin size={20} /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
