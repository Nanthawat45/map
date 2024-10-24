import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <AuthProvider>
      <Navbar />
      <div className="h-screen">
        <Outlet />
      </div>
      <Footer />
    </AuthProvider>
  );
};
export default Layout;