import CourseTab from '@/AppComonents/Admin/CourseTab'
import { ArrowLeft, UploadCloud } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

const EditCourse = () => {
    const { courseId } = useParams();
  
  return (
    <div className="flex-1 space-y-6">
      <Link to="/admin/add-course" className="inline-flex items-center gap-2 text-sm font-semibold text-[#82978f] hover:text-[#f6f3de]">
        <ArrowLeft size={16}/> Course library
      </Link>
      
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-.05em] text-[#f6f3de]">
            Course details
          </h1>
          <p className="muted-copy mt-1 text-sm">Provide basic details and publish settings.</p>
        </div>
        <Link to={`/admin/add-course/${courseId}/lectures`}>
          <button className="ghost-button text-sm min-h-11">
            <UploadCloud size={16} />
            Manage lectures
          </button>
        </Link>
      </div>

      <CourseTab />
    </div>
  )
}

export default EditCourse;