import React, { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEditLectureMutation, useGetLectureQuery, useRemoveLectureMutation } from '../../Features/Apis/courseApi.js'
import { Loader2, Sparkles, Trash2, Save, Video, HelpCircle } from 'lucide-react'

const LectureTab = () => {
    const navigate = useNavigate();
    const { lectureId, courseId } = useParams();
    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [uploadMediaProgress, setUploadMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [buttonDisable, setButtonDisable] = useState(true);

    const { data: lectureData, refetch } = useGetLectureQuery(courseId);
    const apiRoot = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
    const MEDIA_API = `${apiRoot}/media`;

    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removeLecture, { data: removeData, isLoading: removeLoad, isSuccess: removeSuccess, error: removeError }] = useRemoveLectureMutation();

    // Populate existing lecture details
    useEffect(() => {
        if (lectureData?.lectures) {
            const currentLecture = lectureData.lectures.find(lec => lec._id === lectureId);
            if (currentLecture) {
                setLectureTitle(currentLecture.lectureTitle || "");
                setIsFree(currentLecture.isPreviewFree || false);
                if (currentLecture.videoUrl) {
                    setUploadVideoInfo({
                        videoUrl: currentLecture.videoUrl,
                        publicId: currentLecture.publicId || ""
                    });
                    setButtonDisable(false);
                }
            }
        }
    }, [lectureData, lectureId]);

    const removeLectureHandler = async () => {
        if (window.confirm("Are you sure you want to remove this lecture? This action is permanent.")) {
            await removeLecture(lectureId);
        }
    };

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setUploadMediaProgress(true);
            setUploadProgress(0);

            try {
                const result = await axios.post(`${MEDIA_API}/uploadVideo`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded / total) * 100));
                    }
                });

                if (result.data.success) {
                    setUploadVideoInfo({
                        videoUrl: result.data.data.secure_url,
                        publicId: result.data.data.public_id
                    });
                    setButtonDisable(false);
                    toast.success("Video uploaded successfully", { className: "custom-toast" });
                }
            } catch (e) {
                console.log(e);
                toast.error("Video upload failed", { className: "custom-toast" });
            } finally {
                setUploadMediaProgress(false);
            }
        }
    };

    const btnClickHandler = async () => {
        if (!lectureTitle.trim()) {
            toast.error("Please provide a lecture title", { className: "custom-toast" });
            return;
        }
        await editLecture({
            lectureTitle: lectureTitle.trim(),
            videoInfo: uploadVideoInfo,
            isPreviewFree: isFree,
            courseId,
            lectureId,
        });
    };

    useEffect(() => {
        if (removeSuccess) {
            toast.success(removeData?.message || "Lecture removed successfully", { className: "custom-toast" });
            refetch();
            navigate(`/admin/add-course/${courseId}/lectures`);
        }
        if (removeError) {
            toast.error(removeError?.message || removeError?.data?.message || "An error occurred", { className: "custom-toast" });
        }
    }, [removeSuccess, removeError]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Lecture updated successfully", { className: "custom-toast" });
            refetch();
            navigate(`/admin/add-course/${courseId}/lectures`);
        }
        if (error) {
            toast.error(error?.message || error?.data?.message || "An error occurred", { className: "custom-toast" });
        }
    }, [isSuccess, error]);

    return (
        <div className="surface rounded-[28px] p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-5 border-b border-white/10 pb-6 mb-6">
                <div>
                    <span className="eyebrow"><Sparkles size={13}/> Lecture settings</span>
                    <h2 className="text-xl font-extrabold text-[#f6f3de] mt-2">Edit Lecture</h2>
                    <p className="muted-copy mt-1 text-xs">Configure the metadata and video file for this lesson.</p>
                </div>
                <div>
                    <button
                        onClick={removeLectureHandler}
                        disabled={removeLoad}
                        className="min-h-10 px-4 rounded-full border border-red-500/20 bg-red-950/10 text-red-400 text-xs font-semibold hover:bg-red-950/30 hover:border-red-500/50 hover:text-red-300 disabled:opacity-40 transition flex items-center gap-2"
                    >
                        <Trash2 size={14} />
                        {removeLoad ? "Removing..." : "Remove Lecture"}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Title */}
                <label className="block max-w-2xl">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Lecture Title</span>
                    <input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="e.g. Introduction to HTML"
                        className="w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-3.5 text-sm outline-none placeholder:text-[#4e645b] focus:border-[#c9ff62]/50"
                    />
                </label>

                {/* Video Upload */}
                <div className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">
                        Video Asset <span className="text-red-500 ml-0.5">*</span>
                    </span>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        className="w-full max-w-sm rounded-xl border border-white/10 bg-[#07110f] px-3 py-2 text-sm text-[#82978f] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#c9ff62]/10 file:text-[#c9ff62] hover:file:bg-[#c9ff62]/20 cursor-pointer"
                    />
                    
                    {uploadVideoInfo?.videoUrl && !uploadMediaProgress && (
                        <div className="surface rounded-2xl overflow-hidden w-full max-w-[320px] aspect-video border border-white/10 mt-4 p-2 bg-[#07110f] flex flex-col justify-center items-center">
                            <Video className="text-[#c9ff62]" size={32} />
                            <p className="text-xs text-[#8ea197] mt-2 font-semibold">Video file is linked</p>
                        </div>
                    )}
                </div>

                {/* Free Preview Switch */}
                <div className="flex items-center gap-3 py-2">
                    <Switch id="isFree" checked={isFree} onCheckedChange={setIsFree} />
                    <label htmlFor="isFree" className="text-sm font-semibold text-[#aabbb4] cursor-pointer flex items-center gap-1.5 select-none">
                        Allow free preview <HelpCircle size={14} className="text-[#5d726a]" title="Anyone can watch this lecture without purchasing the course." />
                    </label>
                </div>

                {/* Upload Progress */}
                {uploadMediaProgress && (
                    <div className="my-4 max-w-sm space-y-2 p-4 rounded-2xl border border-[#c9ff62]/20 bg-[#c9ff62]/5">
                        <div className="flex items-center justify-between text-xs font-bold text-[#c9ff62]">
                            <span>Uploading video file...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#c9ff62] h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="border-t border-white/10 pt-6 mt-6">
                    <button
                        onClick={btnClickHandler}
                        disabled={buttonDisable || isLoading}
                        className="lime-button min-h-11 px-6 text-sm flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={15} />}
                        Save settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LectureTab;
