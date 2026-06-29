import { BadgeInfo, BookOpen, Check, Clock3, Loader2, Lock, PlayCircle, Users } from "lucide-react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import BuyButton from "@/AppComonents/Commom/BuyButton";
import { useGetCourseDetailStatusQuery } from "@/Features/Apis/purcaseApi";

const CourseDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data, isLoading, isError } = useGetCourseDetailStatusQuery(courseId);

  if (isLoading) return <div className="grid min-h-[75vh] place-items-center"><Loader2 className="animate-spin text-[#c9ff62]"/></div>;
  if (isError) return <div className="page-container grid min-h-[60vh] place-items-center text-[#ff9b8f]">We couldn’t load this course.</div>;

  const { course, purchased } = data || {};
  const preview = course?.lectures?.find((lecture) => lecture.isPreviewFree && lecture.videoUrl) || course?.lectures?.[0];

  return (
    <div className="page-container pb-20 pt-8">
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0d1d19]">
        <div className="grid lg:grid-cols-[1.1fr_.9fr]">
          <div className="flex flex-col justify-center p-7 md:p-12">
            <span className="eyebrow">{course?.category || "Featured course"}</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.03] tracking-[-.06em] text-[#f6f3de] md:text-6xl">{course?.courseTitle}</h1>
            <p className="muted-copy mt-5 max-w-2xl text-base leading-7">{course?.subTitle}</p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-[#9badb6]">
              <span className="flex items-center gap-2"><Users size={16} className="text-[#c9ff62]"/>{course?.enrolledStudents?.length || 0} learners</span>
              <span className="flex items-center gap-2"><BookOpen size={16} className="text-[#c9ff62]"/>{course?.lectures?.length || 0} lessons</span>
              <span className="flex items-center gap-2"><Clock3 size={16} className="text-[#c9ff62]"/>{course?.courseLevel}</span>
            </div>
          </div>
          <div className="border-t border-white/10 bg-[#132a24] p-5 lg:border-l lg:border-t-0">
            <div className="aspect-video overflow-hidden rounded-[22px] bg-[#07110f]"><ReactPlayer width="100%" height="100%" url={preview?.videoUrl} controls/></div>
            <div className="flex items-end justify-between gap-5 p-3 pt-6"><div><p className="text-xs uppercase tracking-[.14em] text-[#72887f]">{purchased ? "Already enrolled" : "One-time access"}</p><p className="mt-1 text-3xl font-extrabold text-[#f6f3de]">{purchased ? "Continue learning" : `₹${course?.coursePrice || 0}`}</p></div>
            <div className="min-w-40">{purchased ? <button onClick={() => navigate(`/course-progress/${courseId}`)} className="lime-button w-full">Continue</button> : <BuyButton courseId={courseId} coursePrice={course?.coursePrice} courseTitle={course?.courseTitle}/>}</div></div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="surface rounded-[28px] p-6 md:p-8"><span className="eyebrow">What you’ll learn</span><div className="mt-5 text-sm leading-7 text-[#a6b7b0]" dangerouslySetInnerHTML={{ __html: course?.description || "A focused learning experience built around practical progress." }}/></section>
        <section className="surface rounded-[28px] p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-extrabold text-[#f6f3de]">Course outline</h2><span className="text-xs text-[#71877e]">{course?.lectures?.length || 0} lessons</span></div><div className="mt-5 space-y-2">{course?.lectures?.map((lecture, index) => <div key={lecture._id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.02] p-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${lecture.isPreviewFree || purchased ? "bg-[#c9ff62]/10 text-[#c9ff62]" : "bg-white/5 text-[#5d726a]"}`}>{lecture.isPreviewFree || purchased ? <PlayCircle size={16}/> : <Lock size={15}/>}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#d9e2de]">{lecture.lectureTitle}</p><p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#637970]">Lesson {index + 1}</p></div></div>)}</div></section>
      </div>
    </div>
  );
};

export default CourseDetail;
