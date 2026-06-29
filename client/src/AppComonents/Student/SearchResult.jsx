import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => (
  <Link to={`/detail-page/${course._id}`} className="group flex flex-col gap-5 rounded-[24px] border border-white/10 bg-[#0d1d19] p-3 transition hover:border-[#c9ff62]/30 sm:flex-row">
    <div className="aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-[#17352d] sm:w-56">
      {course.courseThumbnail && <img src={course.courseThumbnail} alt={course.courseTitle} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>}
    </div>
    <div className="flex min-w-0 flex-1 flex-col p-2 sm:py-3">
      <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#c9ff62]">{course.category || "Course"}</p><h3 className="mt-2 text-xl font-bold text-[#f6f3de]">{course.courseTitle}</h3></div><ArrowUpRight className="shrink-0 text-[#c9ff62]" size={19}/></div>
      <p className="mt-2 line-clamp-2 text-sm text-[#7f948b]">{course.subTitle}</p>
      <div className="mt-auto flex items-end justify-between pt-4"><p className="text-xs text-[#82978f]">By {course.creator?.name || course.creator?.email?.split("@")[0] || "Koursify mentor"}</p><p className="text-xl font-extrabold text-[#f6f3de]">₹{course.coursePrice || 0}</p></div>
    </div>
  </Link>
);

export default SearchResult;
