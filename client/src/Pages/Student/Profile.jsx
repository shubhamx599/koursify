import { useState } from "react";
import { Camera, Loader2, Mail, Save, UserRound, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Course from "@/AppComonents/Student/course";
import { useGetUserQuery, useUpdateUserMutation, useSwitchRoleMutation } from "@/Features/Apis/authApi";

const Profile = () => {
  const { data, isLoading, refetch } = useGetUserQuery();
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();
  const [switchRole, { isLoading: switching }] = useSwitchRoleMutation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const user = data?.user;

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

  const save = async () => {
    const form = new FormData();
    form.append("name", name || user?.name || "");
    if (photo) form.append("profilePhoto", photo);
    try { await updateUser(form).unwrap(); await refetch(); toast.success("Profile updated"); }
    catch (error) { toast.error(error?.data?.message || "Couldn’t update your profile"); }
  };

  if (isLoading) return <div className="grid min-h-[70vh] place-items-center"><Loader2 className="animate-spin text-[#c9ff62]"/></div>;

  return (
    <div className="page-container pb-20 pt-8">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="surface h-fit rounded-[28px] p-6 lg:sticky lg:top-28">
          <div className="relative mx-auto w-fit">
            <Avatar className="h-28 w-28 border-4 border-[#c9ff62]/15"><AvatarImage src={photo ? URL.createObjectURL(photo) : user?.photoUrl}/><AvatarFallback className="bg-[#193029] text-2xl text-[#c9ff62]">{(user?.name || user?.email || "K").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
            <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-[#c9ff62] text-[#07110f]"><Camera size={15}/><input type="file" accept="image/*" className="hidden" onChange={(event) => setPhoto(event.target.files?.[0] || null)}/></label>
          </div>
          <h1 className="mt-5 text-center text-2xl font-extrabold text-[#f6f3de]">{user?.name || "Your profile"}</h1>
          <p className="mt-1 text-center text-xs uppercase tracking-[.13em] text-[#71877e]">{user?.role}</p>
          <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
            <p className="flex items-center gap-3 text-sm text-[#9badb6]"><Mail size={16} className="text-[#c9ff62]"/>{user?.email}</p>
            <p className="flex items-center gap-3 text-sm text-[#9badb6]"><UserRound size={16} className="text-[#c9ff62]"/>{user?.enrolledCourses?.length || 0} enrolled courses</p>
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <button
              onClick={handleSwitchRole}
              disabled={switching}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#c9ff62]/20 bg-[#c9ff62]/5 py-2.5 text-xs font-bold text-[#c9ff62] hover:bg-[#c9ff62]/10 transition disabled:opacity-40 select-none cursor-pointer"
            >
              <RefreshCw size={14} className={switching ? "animate-spin" : ""} />
              {user?.role === "instructor" ? "Switch to Student" : "Switch to Instructor"}
            </button>
          </div>
        </aside>
        <div>
          <section className="surface rounded-[28px] p-6 md:p-8">
            <span className="eyebrow">Personal details</span><h2 className="mt-4 text-3xl font-extrabold text-[#f6f3de]">Make it feel like yours.</h2>
            <label className="mt-7 block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Display name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder={user?.name || "How should we address you?"} className="w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-4 outline-none focus:border-[#c9ff62]/50"/></label>
            <button onClick={save} disabled={saving} className="lime-button mt-5">{saving ? <Loader2 className="animate-spin" size={17}/> : <Save size={17}/>} Save changes</button>
          </section>
          <section className="mt-8"><h2 className="text-2xl font-extrabold text-[#f6f3de]">Your courses</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">{user?.enrolledCourses?.map((course) => <Course key={course._id} course={course}/>)}</div></section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
