import { Edit3 } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Lecture = ({ lecture, index, courseId }) => {
  const navigate = useNavigate();
  
  const goToUpdateLecture = () => {
    navigate(`/admin/add-course/${courseId}/lectures/${lecture._id}/edit`);
  };

  const title = lecture?.lectureTitle 
    ? lecture.lectureTitle.charAt(0).toUpperCase() + lecture.lectureTitle.slice(1)
    : "Untitled Lecture";

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#0d1d19]/40 transition hover:bg-[#0d1d19]/80">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#637970]">
          Lecture {index + 1}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-[#f6f3de] truncate">
          {title}
        </h3>
      </div>
      <button 
        onClick={goToUpdateLecture}
        title="Edit lecture settings"
        className="grid h-9 w-9 place-items-center rounded-full bg-[#c9ff62]/10 text-[#c9ff62] hover:bg-[#c9ff62] hover:text-[#07110f] transition duration-200"
      >
        <Edit3 size={15} />
      </button>
    </div>
  );
};

export default Lecture;