import { useEffect } from "react";
import { ArrowUpRight, BookOpen, LayoutDashboard, LogOut, RefreshCw, UserRound } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserQuery, useLogoutUserMutation, useSwitchRoleMutation } from "@/Features/Apis/authApi";

const GlassNavbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { data: profile } = useGetUserQuery(undefined, { skip: !isAuthenticated });
  const [logout, { data, isSuccess }] = useLogoutUserMutation();
  const [switchRole, { isLoading: switching }] = useSwitchRoleMutation();
  const user = profile?.user;
  const initials = (user?.name || user?.email || "K").slice(0, 2).toUpperCase();

  const handleSwitchRole = async () => {
    try {
      const response = await switchRole().unwrap();
      toast.success(response.message);
      if (response.user?.role === "student") {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to switch role");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "You’re signed out");
      navigate("/auth");
    }
  }, [data?.message, isSuccess, navigate]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <nav className="page-container surface flex h-[68px] items-center justify-between rounded-[22px] px-4 md:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#c9ff62] text-[#07110f]">
            <BookOpen size={20} strokeWidth={2.5} />
          </span>
          <span className="font-['Manrope'] text-lg font-extrabold tracking-[-0.04em] text-[#f6f3de]">
            Koursify<span className="text-[#c9ff62]">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-[#9dafa8] md:flex">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-[#f6f3de]" : "hover:text-[#f6f3de]"}>Discover</NavLink>
          <NavLink to="/course/search?query=" className="hover:text-[#f6f3de]">Explore courses</NavLink>
          {isAuthenticated && <NavLink to="/my-learning" className="hover:text-[#f6f3de]">My learning</NavLink>}
        </div>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] p-1 pr-3 outline-none transition hover:border-[#c9ff62]/40">
              <Avatar className="h-9 w-9 border border-[#c9ff62]/25">
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="bg-[#193029] text-[#c9ff62]">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-24 truncate text-sm font-semibold text-[#f6f3de] sm:block">
                {user?.name || user?.email?.split("@")[0] || "Account"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 w-60 rounded-2xl border-white/10 bg-[#0d1d19]/95 p-2 text-[#f6f3de] shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-sm font-semibold">{user?.name || "Your account"}</p>
                <p className="mt-1 truncate text-xs font-normal text-[#82968e]">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild><Link to="/my-learning" className="gap-3 rounded-xl"><BookOpen size={16}/>My learning</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/my-profile" className="gap-3 rounded-xl"><UserRound size={16}/>Profile</Link></DropdownMenuItem>
              {user?.role === "instructor" && (
                <DropdownMenuItem asChild><Link to="/admin/dashboard" className="gap-3 rounded-xl"><LayoutDashboard size={16}/>Instructor studio</Link></DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleSwitchRole} disabled={switching} className="gap-3 rounded-xl cursor-pointer text-[#c9ff62] focus:text-[#c9ff62] focus:bg-[#c9ff62]/10">
                <RefreshCw size={16} className={switching ? "animate-spin" : ""} />
                {user?.role === "instructor" ? "Switch to Student" : "Switch to Instructor"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={() => logout()} className="gap-3 rounded-xl text-[#ff9b8f] focus:text-[#ff9b8f]"><LogOut size={16}/>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth" className="lime-button min-h-10 px-4 text-sm">
            Sign in <ArrowUpRight size={16}/>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default GlassNavbar;
