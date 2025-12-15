import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Menu,
  X,
  Trophy,
  Flag,
  User,
  LogOut,
  Shield,
  Sun,
  Moon,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/index";
import { useTheme } from "../../context/index";
import Button from "../ui/Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinks = [
    { path: "/challenges", label: "Challenges", icon: Flag },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const authLinks = [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/submissions", label: "My Submissions", icon: Shield },
  ];

  const isDark = theme === "dark";

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors ${
        isDark
          ? "bg-gray-950/80 border-gray-800"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary-600 hover:text-primary-500 transition-colors"
          >
            <Shield className="h-7 w-7" />
            <span className="hidden sm:inline">CyberQuest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-primary-600/20 text-primary-600"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}

            {isAuthenticated &&
              authLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? "bg-primary-600/20 text-primary-600"
                      : isDark
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}

            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/admin")
                    ? "bg-yellow-600/20 text-yellow-500"
                    : isDark
                    ? "text-yellow-400 hover:bg-yellow-900/30"
                    : "text-yellow-600 hover:bg-yellow-50"
                }`}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth & Theme */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-yellow-400 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Welcome,{" "}
                  <span className="text-primary-600 font-medium">
                    {user?.username}
                  </span>
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Theme Toggle & Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-yellow-400 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 border-t ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path)
                      ? "bg-primary-600/20 text-primary-600"
                      : isDark
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}

              {isAuthenticated &&
                authLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(path)
                        ? "bg-primary-600/20 text-primary-600"
                        : isDark
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}

              {/* Admin Link - Mobile */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "bg-yellow-600/20 text-yellow-500"
                      : isDark
                      ? "text-yellow-400 hover:bg-yellow-900/30"
                      : "text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Admin
                </Link>
              )}

              <div
                className={`border-t mt-2 pt-2 ${
                  isDark ? "border-gray-800" : "border-gray-200"
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <div
                      className={`px-4 py-2 text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Signed in as{" "}
                      <span className="text-primary-600 font-medium">
                        {user?.username}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isDark
                          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-4 py-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
