import { ArrowUpRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Course = ({ course }) => {
  const navigate = useNavigate();
  const creatorName = course?.creator?.name || course?.creator?.email?.split("@")[0] || "Koursify mentor";

  return (
    <article
      onClick={() => navigate(`/detail-page/${course?._id}`)}
      className="group cursor-pointer overflow-hidden rounded-[26px] border border-white/10 bg-[#0d1d19] transition duration-300 hover:-translate-y-1 hover:border-[#c9ff62]/30 hover:shadow-[0_28px_70px_rgba(0,0,0,.3)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#17352d]">
        {course?.courseThumbnail ? (
          <img src={course.courseThumbnail} alt={course.courseTitle} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"/>
        ) : (
          <div className="grid h-full place-items-center text-5xl font-black text-[#c9ff62]/25">K.</div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#07110f]/75 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#d9e6d8] backdrop-blur-md">
          {course?.category || "Featured"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-xl font-bold leading-snug text-[#f6f3de]">{course?.courseTitle}</h3>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-[#c9ff62] transition group-hover:bg-[#c9ff62] group-hover:text-[#07110f]">
            <ArrowUpRight size={17}/>
          </span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#81968e]">{course?.subTitle || "A practical course designed to move your skills forward."}</p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7"><AvatarImage src={course?.creator?.photoUrl}/><AvatarFallback className="bg-[#193029] text-[10px] text-[#c9ff62]">{creatorName.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
            <span className="max-w-28 truncate text-xs font-semibold text-[#b7c4be]">{creatorName}</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#f6f3de]">₹{course?.coursePrice || 0}</p>
            <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#6f847c]"><Clock3 size={10}/>{course?.courseLevel || "Beginner"}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Course;
