import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const MapLayout = () => {
  return (
    <div className="container mx-auto">
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default MapLayout;