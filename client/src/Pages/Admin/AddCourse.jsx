import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCourseMutation, useGetCourseQuery } from "@/Features/Apis/courseApi";

const categoryGroups = [
  { label: "Web development", courses: ["HTML", "CSS", "JavaScript", "React", "Vue.js", "Next.js"] },
  { label: "Data & AI", courses: ["Python", "SQL", "Machine Learning", "Pandas"] },
  { label: "Backend", courses: ["Node.js", "Django", "Spring Boot", "GoLang"] },
  { label: "Cloud", courses: ["AWS", "Azure", "Google Cloud", "Kubernetes"] },
  { label: "Security", courses: ["Ethical Hacking", "Network Security"] },
];

const AddCourse = () => {
  const navigate = useNavigate();
  const { refetch } = useGetCourseQuery();
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) { toast.success(data?.message || "Course created"); refetch(); navigate("/admin/add-course"); }
    if (error) toast.error(error?.data?.message || "Couldn’t create the course");
  }, [data?.message, error, isSuccess, navigate, refetch]);

  return (
    <div className="mx-auto max-w-3xl py-3 md:py-8">
      <Link to="/admin/add-course" className="inline-flex items-center gap-2 text-sm font-semibold text-[#82978f] hover:text-[#f6f3de]"><ArrowLeft size={16}/> Course library</Link>
      <div className="mt-8"><span className="eyebrow"><Sparkles size={14}/> New course</span><h1 className="mt-4 text-4xl font-extrabold tracking-[-.055em] text-[#f6f3de]">Start with a strong premise.</h1><p className="muted-copy mt-3">Give your course a clear title and a useful home. You can shape the details next.</p></div>
      <div className="mt-9 space-y-6 rounded-[24px] border border-white/10 bg-[#10231e] p-6 md:p-8">
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Course title</span><input value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} placeholder="e.g. Design systems that scale" className="w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-4 outline-none focus:border-[#c9ff62]/50"/></label>
        <div><span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Category</span>
          <Select onValueChange={setCategory}><SelectTrigger className="h-14 w-full rounded-2xl border-white/10 bg-[#07110f]"><SelectValue placeholder="Choose the closest category"/></SelectTrigger><SelectContent className="border-white/10 bg-[#0d1d19] text-[#f6f3de]">{categoryGroups.map((group) => <SelectGroup key={group.label}><SelectLabel>{group.label}</SelectLabel>{group.courses.map((course) => <SelectItem key={course} value={course.toLowerCase()}>{course}</SelectItem>)}</SelectGroup>)}</SelectContent></Select>
        </div>
        <div className="flex justify-end border-t border-white/10 pt-6"><button disabled={!courseTitle || !category || isLoading} onClick={() => createCourse({ courseTitle, category })} className="lime-button disabled:cursor-not-allowed disabled:opacity-40">{isLoading ? <Loader2 className="animate-spin" size={17}/> : <>Create course <ArrowRight size={17}/></>}</button></div>
      </div>
    </div>
  );
};

export default AddCourse;
