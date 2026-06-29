import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetPublishCourseQuery } from "../../Features/Apis/courseApi.js";
import { SkeletonCard } from "../Commom/CourseSkeleton.jsx";
import Course from "./course.jsx";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishCourseQuery();
  const courses = data?.courses || [];

  return (
    <section className="page-container py-20 md:py-28">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <span className="eyebrow">Fresh perspectives</span>
          <h2 className="section-title mt-4">Courses worth your attention.</h2>
          <p className="muted-copy mt-3 max-w-xl">Curated learning paths built for useful, visible progress.</p>
        </div>
        <Link to="/course/search?query=" className="ghost-button w-fit text-sm">Browse all courses <ArrowRight size={16}/></Link>
      </div>

      {isError ? (
        <div className="surface mt-10 rounded-[24px] p-8 text-center text-[#9dafa8]">Courses are taking a breather. Try again shortly.</div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : courses.map((course) => <Course key={course._id} course={course}/>)}
        </div>
      )}
    </section>
  );
};

export default Courses;
