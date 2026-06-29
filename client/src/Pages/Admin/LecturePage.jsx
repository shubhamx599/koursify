import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, PlayCircle, Plus, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateLectureMutation, useGetLectureQuery } from '@/Features/Apis/courseApi';
import Lecture from '@/AppComonents/Admin/Lecture';

const LecturePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { refetch } = useGetLectureQuery(courseId);
  const { data: lectureData = {}, isLoading: LectLoad, isError: lecterror } = useGetLectureQuery(courseId);
  const [lectureTitle, setLectureTitle] = useState("");
  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) return;
    await createLecture({ lectureTitle: lectureTitle.trim(), courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture created successfully", { className: "custom-toast" });
      setLectureTitle("");
      refetch();
    }
    if (error) {
      toast.error(error?.message || error?.data?.message || "An error occurred", { className: "custom-toast" });
    }
  }, [isSuccess, error]);

  return (
    <div className="flex-1 space-y-6">
      <Link to={`/admin/add-course/${courseId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#82978f] hover:text-[#f6f3de]">
        <ArrowLeft size={16}/> Back to course details
      </Link>

      <div className="surface rounded-[28px] p-6 md:p-8">
        <div>
          <span className="eyebrow"><Sparkles size={13}/> Course lectures</span>
          <h1 className="text-3xl font-extrabold tracking-[-.05em] text-[#f6f3de] mt-2">
            Build your curriculum
          </h1>
          <p className="muted-copy mt-1 text-sm">Create and organize your lectures. You can add videos and customize settings for each lecture below.</p>
        </div>

        <div className="mt-8 space-y-5 max-w-2xl border-t border-white/10 pt-6">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Lecture Title</span>
            <input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              type="text"
              placeholder="e.g. Introduction to Figma variables"
              className="w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-3.5 text-sm outline-none placeholder:text-[#4e645b] focus:border-[#c9ff62]/50"
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              onClick={createLectureHandler}
              disabled={isLoading || !lectureTitle.trim()}
              className="lime-button min-h-11 px-6 text-sm flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
              Create lecture
            </button>
          </div>
        </div>
      </div>

      <div className="surface rounded-[28px] p-6 md:p-8">
        <div className="border-b border-white/10 pb-4 mb-4">
          <h2 className="text-xl font-extrabold text-[#f6f3de] flex items-center gap-2">
            <PlayCircle size={18} className="text-[#c9ff62]"/> Lectures List
          </h2>
          <p className="muted-copy text-xs mt-1">
            {LectLoad ? "Loading..." : `${lectureData?.lectures?.length || 0} lectures defined`}
          </p>
        </div>

        {LectLoad ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#c9ff62]" size={28} />
          </div>
        ) : lecterror ? (
          <div className="text-center py-8 text-red-400 text-sm">Failed to load lectures. Please try again.</div>
        ) : !lectureData?.lectures || lectureData.lectures.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-[#61776e]">
            <p className="text-sm font-semibold text-[#f6f3de]">No lectures created yet.</p>
            <p className="text-xs mt-1">Start by adding your first lecture title above.</p>
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {lectureData.lectures.map((lecture, index) => (
              <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturePage;