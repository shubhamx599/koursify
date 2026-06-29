import { useEffect } from "react";
import { BarChart3, BookOpen, LogOut, Plus } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserQuery, useLogoutUserMutation } from "@/Features/Apis/authApi";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { data: profile } = useGetUserQuery();
  const [logout, { isSuccess }] = useLogoutUserMutation();
  const user = profile?.user;

  useEffect(() => {
    if (isSuccess) {
      toast.success("You’re signed out");
      navigate("/auth");
    }
  }, [isSuccess, navigate]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07110f]/85 backdrop-blur-xl">
      <div className="page-container flex h-[80px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#c9ff62] text-[#07110f]"><BookOpen size={20}/></span>
          <div><p className="font-['Manrope'] text-base font-extrabold text-[#f6f3de]">Koursify.</p><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#648077]">Instructor</p></div>
        </Link>

        <nav className="flex items-center gap-1 lg:hidden">
          <NavLink to="/admin/dashboard" className="rounded-xl p-2.5 text-[#91a49d] hover:bg-white/5"><BarChart3 size={19}/></NavLink>
          <NavLink to="/admin/add-course" className="rounded-xl p-2.5 text-[#91a49d] hover:bg-white/5"><BookOpen size={19}/></NavLink>
          <NavLink to="/admin/add-course/create-course" className="rounded-xl p-2.5 text-[#c9ff62] hover:bg-white/5"><Plus size={19}/></NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block"><p className="max-w-40 truncate text-sm font-semibold text-[#f6f3de]">{user?.name || user?.email?.split("@")[0]}</p><p className="text-[10px] uppercase tracking-wider text-[#698078]">Instructor account</p></div>
          <Avatar className="h-10 w-10 border border-[#c9ff62]/25"><AvatarImage src={user?.photoUrl}/><AvatarFallback className="bg-[#193029] text-[#c9ff62]">IN</AvatarFallback></Avatar>
          <button onClick={() => logout()} title="Sign out" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[#83978f] transition hover:border-red-300/30 hover:text-red-300"><LogOut size={16}/></button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
