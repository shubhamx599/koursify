import { Outlet } from "react-router-dom";
import GlassNavbar from "../Commom/Navbar.jsx";

const HeroPage = () => (
  <div className="site-shell">
    <GlassNavbar />
    <main className="pt-[92px] md:pt-[108px]">
      <Outlet />
    </main>
  </div>
);

export default HeroPage;
