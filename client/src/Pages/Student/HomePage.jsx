import { useState } from "react";
import { ArrowRight, BookOpenCheck, Play, Search, Sparkles, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Courses from "@/AppComonents/Student/Courses";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const searchHandler = (event) => {
    event.preventDefault();
    navigate(`/course/search?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <section className="page-container overflow-hidden rounded-[32px] border border-white/10 bg-[#0d1d19]">
        <div className="grid min-h-[620px] lg:grid-cols-[1.18fr_.82fr]">
          <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:px-16">
            <span className="eyebrow"><Sparkles size={14}/> Learn what moves you</span>
            <h1 className="display-title mt-7 max-w-3xl">
              Skills that turn <span className="text-[#c9ff62]">curiosity</span> into momentum.
            </h1>
            <p className="muted-copy mt-7 max-w-xl text-base leading-7 md:text-lg">
              Practical courses, thoughtful instructors, and a learning space designed to keep you moving forward.
            </p>

            <form onSubmit={searchHandler} className="mt-9 flex max-w-xl items-center gap-2 rounded-full border border-white/10 bg-[#07110f] p-2 pl-5 shadow-inner">
              <Search className="shrink-0 text-[#7d938a]" size={19}/>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[#61756d]"
                placeholder="What do you want to learn?"
              />
              <button type="submit" className="lime-button min-h-11 shrink-0 px-4 text-sm md:px-5">
                Search <ArrowRight size={16}/>
              </button>
            </form>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[#9dafa8]">
              <span className="flex items-center gap-2"><UsersRound size={17} className="text-[#c9ff62]"/> Learn at your pace</span>
              <span className="flex items-center gap-2"><BookOpenCheck size={17} className="text-[#c9ff62]"/> Track every milestone</span>
            </div>
          </div>

          <div className="relative hidden overflow-hidden border-l border-white/10 bg-[#132a24] lg:block">
            <div className="absolute -right-16 top-16 h-72 w-72 rounded-full border-[52px] border-[#c9ff62]/90" />
            <div className="absolute bottom-10 left-10 right-10 rounded-[28px] border border-white/10 bg-[#07110f]/80 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#7d938a]">Continue learning</p>
                  <h3 className="mt-2 text-xl font-bold text-[#f6f3de]">Build your next chapter</h3>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#c9ff62] text-[#07110f]"><Play size={18} fill="currentColor"/></span>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-[#77e6d1]"/></div>
              <div className="mt-3 flex justify-between text-xs text-[#9dafa8]"><span>8 of 12 lessons</span><span>68%</span></div>
            </div>
          </div>
        </div>
      </section>

      <Courses />
    </>
  );
};

export default HomePage;
