import { Shield, Github } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../../context/index";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`border-t ${
        isDark ? "bg-gray-950 border-gray-800" : "bg-gray-100 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-500" />
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © {new Date().getFullYear()} CyberQuest. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/challenges"
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-primary-400"
                  : "text-gray-600 hover:text-primary-600"
              }`}
            >
              Challenges
            </Link>
            <Link
              to="/leaderboard"
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-primary-400"
                  : "text-gray-600 hover:text-primary-600"
              }`}
            >
              Leaderboard
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-primary-400"
                  : "text-gray-600 hover:text-primary-600"
              }`}
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
