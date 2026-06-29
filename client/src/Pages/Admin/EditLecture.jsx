import LectureTab from '@/AppComonents/Admin/LectureTab'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

const EditLecture = () => {
  const { courseId } = useParams();
  return (
    <div className="flex-1 space-y-6">
      <Link to={`/admin/add-course/${courseId}/lectures`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#82978f] hover:text-[#f6f3de]">
        <ArrowLeft size={16}/> Back to lectures
      </Link>
      
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-.05em] text-[#f6f3de]">
            Update lecture
          </h1>
          <p className="muted-copy mt-1 text-sm">Edit lecture metadata and video assets.</p>
        </div>
      </div>

      <LectureTab />
    </div>
  )
}

export default EditLecture;