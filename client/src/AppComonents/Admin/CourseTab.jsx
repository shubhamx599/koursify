import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TextEditor from "../Commom/TextEditor";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Trash2, Globe, EyeOff, Save, X } from "lucide-react";
import { useEditCourseMutation, useGetCourseByIdQuery, useGetCourseQuery, usePublishCourseMutation, useRemoveCourseMutation } from "@/Features/Apis/courseApi";

const CourseTab = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
  const { data: courseByIdData, isLoading: courseByIdLoading, refetch: refetchCourse } = useGetCourseByIdQuery(courseId);
  const [publishCourse] = usePublishCourseMutation();
  const { refetch } = useGetCourseQuery();

  const [preview, setPreview] = useState();
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const categories = [
    { label: "Web Development", courses: ["HTML", "CSS", "JavaScript", "React", "Vue.js", "Next.js"] },
    { label: "Data Science & Analytics", courses: ["Python", "R", "SQL", "Machine Learning", "Pandas"] },
    { label: "Backend Development", courses: ["Node.js", "Django", "Spring Boot", "GoLang"] },
    { label: "Cloud Computing", courses: ["AWS", "Azure", "Google Cloud", "Kubernetes"] },
    { label: "Cybersecurity", courses: ["Ethical Hacking", "Penetration Testing", "Network Security"] },
    { label: "Programming Languages", courses: ["C", "C++", "Java", "Python", "Rust"] },
  ];

  // Populate data when loaded from backend
  useEffect(() => {
    if (courseByIdData?.course) {
      const c = courseByIdData.course;
      setInput({
        courseTitle: c.courseTitle || "",
        subTitle: c.subTitle || "",
        description: c.description || "",
        category: c.category || "",
        courseLevel: c.courseLevel || "",
        coursePrice: c.coursePrice || "",
        courseThumbnail: "",
      });
      if (c.courseThumbnail) {
        setPreview(c.courseThumbnail);
      }
    }
  }, [courseByIdData]);

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onload = () => setPreview(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const updateCourseHandler = async () => {
    const formdata = new FormData();
    formdata.append("courseTitle", input.courseTitle);
    formdata.append("subTitle", input.subTitle);
    formdata.append("description", input.description);
    formdata.append("category", input.category);
    formdata.append("courseLevel", input.courseLevel);
    formdata.append("coursePrice", input.coursePrice);
    
    if (input.courseThumbnail) {
      formdata.append("courseThumbnail", input.courseThumbnail);
    }

    await editCourse({ formdata, courseId });
  };

  const [removeCourse, { data: removeData, isLoading: removeLoad, isSuccess: removeSuccess, error: removeError }] = useRemoveCourseMutation();
  
  const removeCourseHandler = async () => {
    if (window.confirm("Are you sure you want to remove this course? This action is permanent.")) {
      await removeCourse(courseId);
    }
  };

  const publishHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        refetchCourse();
        toast.success(response.data.message, { className: "custom-toast" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update publish status", { className: "custom-toast" });
    }
  };

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData?.message || "Course removed successfully", { className: "custom-toast" });
      refetch();
      navigate(`/admin/add-course/`);
    }
    if (removeError) {
      toast.error(removeError?.message || removeError?.data?.message || "An error occurred", { className: "custom-toast" });
    }
  }, [removeSuccess, removeError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully", { className: "custom-toast" });
      refetch();
      navigate("/admin/add-course");
    }
    if (error) {
      toast.error(error?.message || error?.data?.message || "An error occurred", { className: "custom-toast" });
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="animate-spin text-[#c9ff62]" size={32} />
      </div>
    );
  }

  const isPublished = courseByIdData?.course.isPublished;

  return (
    <div className="surface rounded-[28px] p-6 md:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-5 border-b border-white/10 pb-6 mb-6">
        <div>
          <span className="eyebrow"><Sparkles size={13}/> Course settings</span>
          <h2 className="text-xl font-extrabold text-[#f6f3de] mt-2">Course Information</h2>
          <p className="muted-copy mt-1 text-xs">Configure your catalog listing details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => publishHandler(isPublished ? "false" : "true")}
            className="ghost-button min-h-10 text-xs px-4 flex items-center gap-2"
          >
            {isPublished ? <EyeOff size={14}/> : <Globe size={14}/>}
            {isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={removeCourseHandler}
            disabled={removeLoad}
            className="min-h-10 px-4 rounded-full border border-red-500/20 bg-red-950/10 text-red-400 text-xs font-semibold hover:bg-red-950/30 hover:border-red-500/50 hover:text-red-300 disabled:opacity-40 transition flex items-center gap-2"
          >
            <Trash2 size={14}/>
            {removeLoad ? "Removing..." : "Remove course"}
          </button>
        </div>
      </div>

      <div className="space-y-6 mt-4">
        {/* Course Title */}
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Course Title</span>
          <input
            type="text"
            name="courseTitle"
            value={input.courseTitle}
            onChange={changeHandler}
            placeholder="e.g. Design systems that scale"
            className="w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#4e645b] focus:border-[#c9ff62]/50"
          />
        </label>

        {/* Subtitle */}
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Sub Title</span>
          <input
            type="text"
            name="subTitle"
            value={input.subTitle}
            onChange={changeHandler}
            placeholder="e.g. Learn how to design, document, and build systems from scratch."
            className="w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#4e645b] focus:border-[#c9ff62]/50"
          />
        </label>

        {/* Description */}
        <div className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Description</span>
          <div className="rounded-2xl border border-white/10 bg-[#07110f] p-2">
            <TextEditor input={input} setInput={setInput} />
          </div>
        </div>

        {/* Category & Course Level */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Category Dropdown */}
          <div className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Category</span>
            <Select value={input.category} onValueChange={(value) => setInput({ ...input, category: value })}>
              <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-[#07110f] text-[#f6f3de]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0d1d19] text-[#f6f3de]">
                {categories.map((category) => (
                  <SelectGroup key={category.label}>
                    <SelectLabel className="text-xs uppercase tracking-wider text-[#6b8278] px-2 py-1.5">{category.label}</SelectLabel>
                    {category.courses.map((course) => (
                      <SelectItem key={course} value={course.toLowerCase()} className="hover:bg-white/5 rounded-xl cursor-pointer">
                        {course}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course Level Dropdown */}
          <div className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Course Level</span>
            <Select value={input.courseLevel} onValueChange={(value) => setInput({ ...input, courseLevel: value })}>
              <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-[#07110f] text-[#f6f3de]">
                <SelectValue placeholder="Select a course level" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0d1d19] text-[#f6f3de]">
                <SelectGroup>
                  <SelectLabel className="text-xs uppercase tracking-wider text-[#6b8278] px-2 py-1.5">Course Level</SelectLabel>
                  <SelectItem value="Beginner" className="hover:bg-white/5 rounded-xl cursor-pointer">Beginner</SelectItem>
                  <SelectItem value="Medium" className="hover:bg-white/5 rounded-xl cursor-pointer">Medium</SelectItem>
                  <SelectItem value="Advance" className="hover:bg-white/5 rounded-xl cursor-pointer">Advance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course Price */}
        <label className="block max-w-[240px]">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Price (INR)</span>
          <input
            type="number"
            name="coursePrice"
            value={input.coursePrice}
            onChange={changeHandler}
            placeholder="e.g. 1999"
            className="w-full rounded-2xl border border-white/10 bg-[#07110f] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#4e645b] focus:border-[#c9ff62]/50"
          />
        </label>

        {/* Course Thumbnail */}
        <div className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[.13em] text-[#70877e]">Course Thumbnail</span>
          <input
            type="file"
            accept="image/*"
            onChange={selectThumbnail}
            className="w-full max-w-sm rounded-xl border border-white/10 bg-[#07110f] px-3 py-2 text-sm text-[#82978f] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#c9ff62]/10 file:text-[#c9ff62] hover:file:bg-[#c9ff62]/20 cursor-pointer"
          />
          {preview && (
            <div className="surface rounded-2xl overflow-hidden w-full max-w-[320px] aspect-[16/10] border border-white/10 mt-4 p-2 bg-[#07110f]">
              <img src={preview} alt="Course Thumbnail" className="w-full h-full object-cover rounded-xl" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/add-course")}
            className="ghost-button min-h-11 px-6 text-sm flex items-center gap-2"
          >
            <X size={15} /> Cancel
          </button>
          <button
            type="button"
            onClick={updateCourseHandler}
            disabled={isLoading}
            className="lime-button min-h-11 px-6 text-sm flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={15} />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseTab;
