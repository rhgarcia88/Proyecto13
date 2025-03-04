import { Link } from "react-router-dom";
import { User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-secondary text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to={ JSON.parse(localStorage.getItem("user"))? "/dashboard": "/"} className="flex items-center space-x-2">
          <div className="flex items-center h-full">
            <img
              src="/logo.png"
              alt="SmartySub Logo"
              className="w-16 h-auto object-contain drop-shadow-md"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))",
              }}
            />
          </div>
        </Link>

<div className="flex flex-row gap-8">
      {/* Navigation */}
      <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-primary text-sm text-black font-poppins">
            Dashboard
          </Link>
        </nav>

        {/* Profile Icon */}
        <Link to="/profile" className="relative">
          <User className="w-6 h-6 text-black hover:text-primary" />
        </Link>
</div>
      
      </div>
    </header>
  );
};

export default Header;
