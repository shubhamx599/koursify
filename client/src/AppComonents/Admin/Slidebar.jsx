import { ArrowLeft, BarChart3, BookOpen, Plus } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Overview", icon: BarChart3 },
  { to: "/admin/add-course", label: "Courses", icon: BookOpen },
];

const Sidebar = () => (
  <aside className="sticky top-[104px] hidden h-[calc(100vh-128px)] w-[230px] shrink-0 flex-col rounded-[28px] border border-white/10 bg-[#0d1d19] p-4 lg:flex">
    <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#587067]">Instructor studio</p>
    <nav className="mt-5 space-y-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-[#c9ff62] text-[#07110f]" : "text-[#90a49c] hover:bg-white/5 hover:text-[#f6f3de]"}`}>
          <Icon size={18}/>{label}
        </NavLink>
      ))}
    </nav>
    <Link to="/admin/add-course/create-course" className="lime-button mt-6 min-h-11 text-sm"><Plus size={16}/> New course</Link>
    <Link to="/" className="mt-auto flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#71877e] hover:text-[#f6f3de]"><ArrowLeft size={15}/> Back to academy</Link>
  </aside>
);

export default Sidebar;
