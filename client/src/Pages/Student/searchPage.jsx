import { useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Filter from "@/AppComonents/Student/Filter";
import SearchResult from "@/AppComonents/Student/SearchResult";
import { SkeletonCard } from "@/AppComonents/Commom/CourseSkeleton";
import { useGetSearhCourseQuery } from "@/Features/Apis/courseApi";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const { data, isLoading } = useGetSearhCourseQuery({ squery: query, categories: selectedCategories, sortByPrice });
  const courses = data?.courses || [];

  return (
    <div className="page-container pb-20 pt-8">
      <div className="rounded-[28px] border border-white/10 bg-[#0d1d19] px-6 py-9 md:px-10">
        <span className="eyebrow"><Search size={14}/> Course finder</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-.055em] text-[#f6f3de]">{query ? `Results for “${query}”` : "Explore the catalogue"}</h1>
        <p className="muted-copy mt-3">{isLoading ? "Searching…" : `${courses.length} course${courses.length === 1 ? "" : "s"} found`}</p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <Filter handleFilterChange={(categories, price) => { setSelectedCategories(categories); setSortByPrice(price); }}/>
        <div className="space-y-4">
          {isLoading ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index}/>) :
            courses.length ? courses.map((course) => <SearchResult key={course._id} course={course}/>) :
            <div className="surface grid min-h-64 place-items-center rounded-[24px] text-[#7f948b]">No courses match those filters yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
