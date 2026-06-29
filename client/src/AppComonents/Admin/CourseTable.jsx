import { ArrowRight, BookOpen, LoaderCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetCourseQuery } from "../../Features/Apis/courseApi";

const CourseTable = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCourseQuery();
  const courses = data?.courses || [];

  if (isLoading) return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="animate-spin text-[#c9ff62]"/></div>;

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><span className="eyebrow">Course library</span><h1 className="mt-4 text-4xl font-extrabold tracking-[-.055em] text-[#f6f3de]">Teach what you know.</h1><p className="muted-copy mt-2">Create, refine, and publish your learning experiences.</p></div>
        <button onClick={() => navigate("/admin/add-course/create-course")} className="lime-button w-fit text-sm"><Plus size={17}/> New course</button>
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-[#10231e]">
        {courses.length ? courses.map((course, index) => (
          <button key={course._id} onClick={() => navigate(`/admin/add-course/${course._id}`)} className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 text-left transition hover:bg-white/[.03] ${index ? "border-t border-white/10" : ""}`}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#c9ff62]/10 text-[#c9ff62]"><BookOpen size={18}/></span>
            <span className="min-w-0"><span className="block truncate text-sm font-bold text-[#f6f3de]">{course.courseTitle}</span><span className="mt-1 flex items-center gap-2 text-xs text-[#6f867d]"><span className={`h-1.5 w-1.5 rounded-full ${course.isPublished ? "bg-[#77e6d1]" : "bg-[#f0b96b]"}`}/>{course.isPublished ? "Published" : "Draft"} · {course.category}</span></span>
            <span className="flex items-center gap-5"><span className="hidden text-right sm:block"><span className="block text-sm font-bold text-[#f6f3de]">₹{course.coursePrice || 0}</span><span className="text-[10px] uppercase tracking-wider text-[#61776e]">Price</span></span><ArrowRight className="text-[#60766d] transition group-hover:translate-x-1 group-hover:text-[#c9ff62]" size={18}/></span>
          </button>
        )) : (
          <div className="grid min-h-72 place-items-center p-8 text-center"><div><BookOpen className="mx-auto text-[#50685e]" size={30}/><p className="mt-4 font-bold text-[#f6f3de]">Your course shelf is empty.</p><p className="mt-2 text-sm text-[#72887f]">Start with one useful idea and build from there.</p></div></div>
        )}
      </div>
    </div>
  );
};

export default CourseTable;
