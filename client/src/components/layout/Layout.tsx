import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "../../context/index";

export default function Layout() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
