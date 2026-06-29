import { BookOpen, Loader2 } from "lucide-react";
import Course from "@/AppComonents/Student/course";
import { useGetUserQuery } from "@/Features/Apis/authApi";

const MyLearning = () => {
  const { data, isLoading } = useGetUserQuery();
  const courses = data?.user?.enrolledCourses || [];

  if (isLoading) return <div className="grid min-h-[70vh] place-items-center"><Loader2 className="animate-spin text-[#c9ff62]"/></div>;

  return (
    <div className="page-container pb-20 pt-8">
      <span className="eyebrow">Your library</span>
      <h1 className="mt-4 text-5xl font-extrabold tracking-[-.06em] text-[#f6f3de]">Keep the momentum.</h1>
      <p className="muted-copy mt-3">Every course you’ve started, ready when you are.</p>
      {courses.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <Course key={course._id} course={course}/>)}</div> :
        <div className="surface mt-10 grid min-h-72 place-items-center rounded-[28px] text-center"><div><BookOpen className="mx-auto text-[#546c62]" size={34}/><p className="mt-5 text-lg font-bold text-[#f6f3de]">Your learning shelf is ready.</p><p className="muted-copy mt-2 text-sm">Choose a course that feels worth beginning.</p></div></div>}
    </div>
  );
};

export default MyLearning;
