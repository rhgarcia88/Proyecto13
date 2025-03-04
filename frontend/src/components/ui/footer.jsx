import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-redVar text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">About SmartySub</h2>
          <p className="text-sm">
            SmartySub helps you manage your subscriptions effortlessly. Track your costs, get reminders, and gain insights to optimize your spending.
          </p>
        </div>

        {/* Quick Links */}
        <div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Follow The Dev</h2>
          <div className="flex space-x-4">
            <a href="https://x.com/JustHunterDev" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/rafa-garcia-dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 text-center text-sm text-gray-100 border-t border-gray-700 pt-4 ">
        <p>&copy; {new Date().getFullYear()} SmartySub</p>
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://x.com/JustHunterDev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @justhunterdev
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
