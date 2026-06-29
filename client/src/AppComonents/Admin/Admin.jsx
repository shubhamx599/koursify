import { Outlet } from "react-router-dom";
import Sidebar from "./Slidebar.jsx";
import AdminNavbar from "../Commom/AdminNavbar.jsx";

const Admin = () => (
  <div className="site-shell min-h-screen">
    <AdminNavbar />
    <div className="page-container flex gap-5 pb-8 pt-[104px]">
      <Sidebar />
      <main className="min-w-0 flex-1 rounded-[28px] border border-white/10 bg-[#0b1916]/70 p-4 shadow-2xl backdrop-blur-xl md:p-7">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Admin;
