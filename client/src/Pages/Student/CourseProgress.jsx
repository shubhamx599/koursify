import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectProgressMutation } from '@/Features/Apis/progressApi';
import { CirclePlay, Loader2Icon, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const CourseProgress = () => {
    const { courseId } = useParams();
    const [currLect, setCurrLect] = useState(null);
    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

    const [updateLectProgress] = useUpdateLectProgressMutation();
    const [completeCourse] = useCompleteCourseMutation();
    const [inCompleteCourse] = useInCompleteCourseMutation();

    if (isLoading) {
        return (
            <div className="grid min-h-[75vh] place-items-center">
                <Loader2Icon className="animate-spin text-[#c9ff62]" size={36} />
            </div>
        );
    }
    if (isError) {
        return (
            <div className="page-container grid min-h-[60vh] place-items-center text-[#ff9b8f]">
                We couldn’t load the course progress.
            </div>
        );
    }

    const { courseDetails, progress, completed } = data.data;
    const { courseTitle, lectures } = courseDetails;

    // Get the current active lecture
    const activeLecture = currLect || lectures?.[0];

    // Function to check if a lecture is completed
    const isLectureCompleted = (lectureId) => {
        return progress.some((progrs) => progrs.lectureId === lectureId && progrs.viewed);
    };

    // Function to update current lecture video
    const handleLectureClick = (lecture) => {
        setCurrLect(lecture);
    };

    const lectureProgressUpdate = async (lectureId) => {
        await updateLectProgress({ courseId, lectureId });
        refetch();
    };

    const handleCompCourse = async () => {
        await completeCourse(courseId);
        refetch();
    };
    
    const handleInCompCourse = async () => {
        await inCompleteCourse(courseId);
        refetch();
    };

    return (
        <div className="page-container pb-20 pt-8">
            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <span className="eyebrow"><Sparkles size={14} /> Course player</span>
                    <h1 className="mt-4 text-3xl font-extrabold tracking-[-.055em] text-[#f6f3de] md:text-4xl">{courseTitle}</h1>
                </div>
                <div>
                    <button
                        onClick={completed ? handleInCompCourse : handleCompCourse}
                        className={completed ? "ghost-button min-h-11 px-5 text-sm text-[#77e6d1] border-[#77e6d1]/20 hover:bg-[#77e6d1]/5" : "lime-button min-h-11 px-5 text-sm"}
                    >
                        {completed ? "Completed" : "Mark as complete"}
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                {/* Video Player */}
                <div className="surface rounded-[28px] p-4 md:p-6 h-fit">
                    <div className="aspect-video overflow-hidden rounded-[20px] bg-[#07110f] border border-white/10 shadow-inner">
                        <video
                            src={activeLecture?.videoUrl}
                            controls
                            onEnded={() => lectureProgressUpdate(currLect?._id || activeLecture?._id)}
                            className="w-full h-full object-contain"
                        ></video>
                    </div>

                    <div className="mt-5 p-5 rounded-2xl border border-white/10 bg-[#0d1d19]">
                        <p className="text-xs uppercase tracking-wider text-[#7c9389]">
                            {`Lesson ${
                                lectures.findIndex((lec) => lec._id.toString() === (currLect?._id?.toString() || activeLecture?._id?.toString())) + 1
                            } of ${lectures.length}`}
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-[#f6f3de]">{activeLecture?.lectureTitle}</h3>
                    </div>
                </div>

                {/* Course Lecture List */}
                <div className="surface rounded-[28px] p-5 flex flex-col max-h-[70vh] lg:sticky lg:top-28">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-[#f6f3de]">Course outline</h2>
                        <p className="mt-1 text-xs text-[#70877e]">{lectures.length} lessons available</p>
                    </div>

                    {/* Scrollable Container */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto pr-1 space-y-2">
                        {lectures.map((lecture, index) => {
                            const isActive = lecture._id === (currLect?._id || activeLecture?._id);
                            const isDone = isLectureCompleted(lecture._id);
                            return (
                                <button
                                    key={lecture._id}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition duration-200 ${
                                        isActive
                                            ? "border-[#c9ff62]/30 bg-[#163028]/80 text-[#f6f3de]"
                                            : "border-white/5 bg-[#0d1d19]/40 hover:bg-[#0d1d19]/80 text-[#b7c4be]"
                                    }`}
                                    onClick={() => handleLectureClick(lecture)}
                                >
                                    <div className="flex items-center min-w-0 mr-3">
                                        <span className={`mr-3 shrink-0 ${isDone ? "text-[#c9ff62]" : "text-[#5d726a]"}`}>
                                            <CirclePlay size={18} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">{lecture.lectureTitle}</p>
                                            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#637970]">Lesson {index + 1}</p>
                                        </div>
                                    </div>
                                    {isDone && (
                                        <span className="shrink-0 rounded-full bg-[#c9ff62]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#c9ff62] border border-[#c9ff62]/20">
                                            Completed
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProgress;
